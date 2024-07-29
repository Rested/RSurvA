import json
import random
import logging
from datetime import datetime, timedelta, timezone
from typing import Annotated, Union

import redis
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel, Field, computed_field
from pydantic_settings import BaseSettings
from pydantic import RedisDsn

# Constants
DEV_FE_URL = "http://localhost:5173"
SURVEY_TTL = 60 * 24 * 30  # save surveys for 30 days


class Settings(BaseSettings):
    log_level: str = "DEBUG"
    fe_url: str = DEV_FE_URL
    redis_url: RedisDsn = "redis://localhost:6379"


settings = Settings()

# Configure logging
logging.basicConfig(level=settings.log_level)
logger = logging.getLogger(__name__)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.fe_url, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency: Get Redis client
def get_redis() -> redis.Redis:
    return redis.Redis.from_url(str(settings.redis_url))


# Models
class Question(BaseModel):
    text: str
    question_type: str


class Survey(BaseModel):
    name: str
    questions: list[Question]
    public_key: str
    survey_id: str
    duration: int  # seconds
    min_responses: int
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    @computed_field
    @property
    def is_expired(self) -> bool:
        return (self.created_at + timedelta(seconds=self.duration)) < datetime.now(
            timezone.utc
        )

    @computed_field
    @property
    def expires_at(self) -> str:
        return (self.created_at + timedelta(seconds=self.duration)).isoformat()

    @computed_field
    @property
    def results_available_till(self) -> str:
        return (
            self.created_at + timedelta(seconds=(self.duration + (SURVEY_TTL * 60)))
        ).isoformat()


class SurveyAnswers(Survey):
    encrypted_answers_sets: list[list[str]]


class EncryptedAnswers(BaseModel):
    encrypted_answers: list[str]


# Utility functions
def save_survey(r: redis.Redis, survey: Survey):
    survey_data = survey.model_dump_json()
    key = f"survey:{survey.survey_id}"
    r.set(key, survey_data)
    logger.debug("Saved survey at '%s'", key)
    r.expire(key, int(round((survey.duration + SURVEY_TTL))))


def shuffle_answers(answer_sets: list[list[str]], num_questions: int) -> list[list[str]]:
    new_answer_sets = [[] for _ in answer_sets]
    for question_idx in range(num_questions):
        all_question_answers = [
            answer_set[question_idx] for answer_set in answer_sets
        ]
        random.shuffle(all_question_answers)
        for answer_set_idx, new_answer_set in enumerate(new_answer_sets):
            new_answer_set.append(all_question_answers[answer_set_idx])
    return new_answer_sets

def retrieve_survey(r: redis.Redis, survey_id: str) -> Union[Survey, SurveyAnswers, None]:
    key = f"survey:{survey_id}"
    logger.debug("Getting survey at '%s'", key)
    survey_data = r.get(key)
    if not survey_data:
        return None

    survey_data = json.loads(survey_data)
    survey = Survey(**survey_data)
    answer_key = f"survey:{survey_id}-encrypted-answers"

    logger.debug("Received %d responses", r.llen(answer_key))

    if survey.is_expired and r.llen(answer_key) >= survey.min_responses:
        answer_sets = [
            json.loads(answer_set) for answer_set in r.lrange(answer_key, 0, -1)
        ]
        num_questions = len(survey.questions)

        for answer_set in answer_sets:
            if len(answer_set) != num_questions:
                logger.error(
                    "Answer set length mismatch. Expected %d, got %d",
                    num_questions,
                    len(answer_set),
                )
                return None
            
        new_answer_sets = shuffle_answers(answer_sets, num_questions)
        return SurveyAnswers(**survey_data, encrypted_answers_sets=new_answer_sets)
    return survey
    

@app.post("/survey", status_code=201)
def create_survey(survey: Survey, r: Annotated[redis.Redis, Depends(get_redis)]):
    save_survey(r, survey)
    return Response(status_code=201)


@app.get("/survey/{survey_id}")
def get_survey(
    survey_id: str, r: Annotated[redis.Redis, Depends(get_redis)]
) -> Survey | SurveyAnswers:
    survey = retrieve_survey(r, survey_id)
    if survey is None:
        raise HTTPException(status_code=404, detail="Survey not found")
    return survey


@app.post("/survey/{survey_id}/answer", status_code=201)
def submit_survey_answer(
    survey_id: str,
    answers: EncryptedAnswers,
    r: Annotated[redis.Redis, Depends(get_redis)],
):
    if not r.exists(f"survey:{survey_id}"):
        raise HTTPException(status_code=404, detail="Survey not found")

    r.rpush(
        f"survey:{survey_id}-encrypted-answers", json.dumps(answers.encrypted_answers)
    )
    return Response(status_code=201)
