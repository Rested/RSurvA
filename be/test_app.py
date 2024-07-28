from datetime import datetime, timezone
import json
from unittest.mock import MagicMock
import time
from fastapi.testclient import TestClient

from app import app, get_redis, Survey, Question, EncryptedAnswers

redis = MagicMock()
app.dependency_overrides[get_redis] = lambda: redis
client = TestClient(app)



# Helper functions
def create_sample_survey():
    questions = [
        Question(text="What is your favorite color?", question_type="text"),
        Question(text="What is your age?", question_type="number")
    ]
    survey = Survey(
        name="Sample Survey",
        questions=questions,
        public_key="abcdef",
        survey_id="testsurvey",
        duration=3600,  # 1 hour
        min_responses=1,
        created_at=datetime.now(timezone.utc)
    )
    return survey

# Test case: create a new survey
def test_create_survey():
    survey = create_sample_survey()
    response = client.post("/survey", content=survey.model_dump_json(), headers={"Content-Type": "application/json"})
    assert response.status_code == 201
    # Verify that the survey was saved in Redis
    redis.set.assert_called_once()
    redis.expire.assert_called_once()

# Test case: retrieve a survey
def test_get_survey():
    survey = create_sample_survey()
    redis.get.return_value = survey.model_dump_json()
    response = client.get(f"/survey/{survey.survey_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == survey.name
    assert len(data['questions']) == len(survey.questions)

# Test case: submit survey answer
def test_submit_survey_answer():
    survey = create_sample_survey()
    redis.exists.return_value = True
    answers = EncryptedAnswers(encrypted_answers=["encrypted_answer1", "encrypted_answer2"])
    response = client.post(f"/survey/{survey.survey_id}/answer", json=answers.model_dump())
    assert response.status_code == 201

    # Verify that the answer was saved in Redis
    redis.rpush.assert_called_once_with(f"survey:{survey.survey_id}-encrypted-answers", json.dumps(answers.encrypted_answers))

# Test case: retrieve survey answers after expiration
def test_get_survey_with_answers():
    survey = create_sample_survey()
    survey.duration = 1  # Set duration to 1 second for testing expiration
    redis.get.return_value = survey.model_dump_json()
    redis.llen.return_value = survey.min_responses
    redis.lrange.return_value = [json.dumps(["encrypted_answer1", "encrypted_answer2"])]

    time.sleep(2)  # Sleep for 2 seconds to simulate expiration

    response = client.get(f"/survey/{survey.survey_id}")
    assert response.status_code == 200
    data = response.json()
    assert "encrypted_answers_sets" in data
    assert len(data["encrypted_answers_sets"]) == 1  # Ex