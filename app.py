import json
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

_logger = logging.getLogger(__name__)
logging.basicConfig(level=os.getenv("LOG_LEVEL", "DEBUG"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FE_URL", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


SURVEY_TTL = 60 * 24 * 30  # save surveys for 30 days


class QuestionTypes(StrEnum):
    PLAINTEXT = "plaintext"


class Question(BaseModel):
    text: str
    question_type: QuestionTypes


class Survey(BaseModel):
    name: str
    questions: list[Question]
    public_key: str
    survey_id: str

    duration: int  # minutes
    min_responses: int

    created_at: datetime = Field(..., default_factory=lambda: datetime.now(UTC))

    @computed_field
    @property
    def is_expired(self) -> bool:
        return (self.created_at + timedelta(seconds=self.duration * 60)) < datetime.now(
            UTC
        )


class SurveyAnswers(Survey):
    encrypted_answers_sets: list[str]

class EncryptedAnswers(BaseModel):
    encrypted_answers: str


surveys = {}
survey_answers = {}


r = redis.Redis(host=os.getenv("REDIS_HOST", "localhost"), port=6379, db=0)


@app.post("/survey")
def create_survey(survey: Survey):
    survey_data = survey.model_dump_json()
    key = f"survey:{survey.survey_id}"
    r.set(key, survey_data)
    _logger.debug(f"saved survey at '%s'", key)
    r.expire(key, SURVEY_TTL * 60)  # setting expiry
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
    _logger.debug("have received %d responses", r.llen(f"survey:{survey_id}-encrypted-answers"))
    if survey.is_expired and r.llen(f"survey:{survey_id}-encrypted-answers") >= survey.min_responses:
        answers = [answer for answer in r.lrange(f"survey:{survey_id}-encrypted-answers", 0, -1)]
        return SurveyAnswers(**survey_data, encrypted_answers_sets=answers)

    return survey

@app.post("/survey/{survey_id}/answer")
def submit_survey_answer(survey_id: str, answers: EncryptedAnswers):
    
    if not r.exists(f"survey:{survey_id}"):
        return Response(status_code=404)
    
    # Add answer to the list of answers in Redis
    r.rpush(f"survey:{survey_id}-encrypted-answers", answers.encrypted_answers)

    return Response(status_code=201)
