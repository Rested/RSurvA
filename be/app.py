import json
import random
from typing import Any
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, Response
from pydantic import BaseModel, Field, computed_field
from enum import StrEnum
from hashlib import sha256
from datetime import datetime, UTC, timedelta
import os

import redis

import logging
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl, RedisDsn

DEV_FE_URL = "http://localhost:5173"


class Settings(BaseSettings):
    log_level: str = "DEBUG"
    fe_url: str = DEV_FE_URL
    redis_url: RedisDsn = "redis://localhost:6379"


settings = Settings()

_logger = logging.getLogger(__name__)
logging.basicConfig(level=settings.log_level)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=list({DEV_FE_URL, settings.fe_url}),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


SURVEY_TTL = 60 * 24 * 30  # save surveys for 30 days


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

    created_at: datetime = Field(..., default_factory=lambda: datetime.now(UTC))

    @computed_field
    @property
    def is_expired(self) -> bool:
        return (self.created_at + timedelta(seconds=self.duration)) < datetime.now(
            UTC
        )

    @computed_field
    @property
    def expires_at(self) -> str:
        return (self.created_at + timedelta(seconds=self.duration)).isoformat()

    @computed_field
    @property
    def results_available_till(self) -> str:
        return (
            self.created_at + timedelta(seconds=(self.duration + (SURVEY_TTL*60)))
        ).isoformat()


class SurveyAnswers(Survey):
    encrypted_answers_sets: list[list[str]]


class EncryptedAnswers(BaseModel):
    encrypted_answers: list[str]


surveys = {}
survey_answers = {}


r = redis.Redis(
    host=settings.redis_url.host,
    port=settings.redis_url.port,
    db=int(settings.redis_url.path.lstrip("/")) or 0,
    password=settings.redis_url.password,
)


@app.post("/survey")
def create_survey(survey: Survey):
    survey_data = survey.model_dump_json()
    key = f"survey:{survey.survey_id}"
    r.set(key, survey_data)
    _logger.debug(f"saved survey at '%s'", key)
    r.expire(key, int(round((survey.duration + SURVEY_TTL))))  # setting expiry
    return Response(status_code=201)


@app.get("/survey/{survey_id}")
def get_survey(survey_id: str) -> Survey | SurveyAnswers:
    key = f"survey:{survey_id}"
    _logger.debug(f"gettings survey at '%s'", key)
    survey_data = r.get(key)
    if not survey_data:
        return Response(status_code=404)

    survey_data = json.loads(survey_data)
    survey = Survey(**survey_data)
    answer_key = f"survey:{survey_id}-encrypted-answers"

    _logger.debug(
        "have received %d responses", r.llen(f"survey:{survey_id}-encrypted-answers")
    )

    if survey.is_expired and r.llen(answer_key) >= survey.min_responses:
        # Retrieve answer sets
        answer_sets = [
            json.loads(answer_set) for answer_set in r.lrange(answer_key, 0, -1)
        ]

        # Ensure answer sets have consistent number of answers
        num_questions = len(survey.questions)
        for answer_set in answer_sets:
            if len(answer_set) != num_questions:
                _logger.error(
                    "Answer set length mismatch. Expected %d, got %d",
                    num_questions,
                    len(answer_set),
                )
                return None

        new_answer_sets = [[] for _ in answer_sets]

        for question_idx in range(num_questions):
            all_question_answers = [
                answer_set[question_idx] for answer_set in answer_sets
            ]
            random.shuffle(all_question_answers)

            for answer_set_idx, new_answer_set in enumerate(new_answer_sets):
                new_answer_set.append(all_question_answers[answer_set_idx])
        return SurveyAnswers(**survey_data, encrypted_answers_sets=new_answer_sets)

    return survey


@app.post("/survey/{survey_id}/answer")
def submit_survey_answer(survey_id: str, answers: EncryptedAnswers):

    if not r.exists(f"survey:{survey_id}"):
        return Response(status_code=404)

    # Add answer to the list of answers in Redis
    r.rpush(
        f"survey:{survey_id}-encrypted-answers", json.dumps(answers.encrypted_answers)
    )

    return Response(status_code=201)
