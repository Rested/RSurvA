from datetime import datetime, timezone
import json
from unittest.mock import MagicMock
import time
from fastapi.testclient import TestClient

from app import app, get_redis, Survey, Question, EncryptedAnswers, shuffle_answers

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

def test_shuffle_answers():
    # Test data
    answer_sets = [
        ["ans1_q1", "ans1_q2"],
        ["ans2_q1", "ans2_q2"],
        ["ans3_q1", "ans3_q2"]
    ]
    num_questions = 2

    shuffled_sets = shuffle_answers(answer_sets, num_questions)
    
    # Ensure the shuffled sets have the same length
    assert len(shuffled_sets) == len(answer_sets)
    
    for idx in range(num_questions):
        original_answers = [answer_set[idx] for answer_set in answer_sets]
        shuffled_answers = [shuffled_set[idx] for shuffled_set in shuffled_sets]
        
        # Ensure each question's answers remain the same
        assert set(original_answers) == set(shuffled_answers)

    # Ensure no answers are lost or duplicated
    all_original = sorted([answer for answer_set in answer_sets for answer in answer_set])
    all_shuffled = sorted([answer for answer_set in shuffled_sets for answer in answer_set])
    assert all_original == all_shuffled

    # Additional randomness check 
    # Run the shuffling multiple times and check that at least once the order changes
    different_order_found = False
    for _ in range(100):
        new_shuffled_sets = shuffle_answers(answer_sets, num_questions)
        for idx in range(num_questions):
            original_answers = [answer_set[idx] for answer_set in answer_sets]
            reshuffled_answers = [reshuffled_set[idx] for reshuffled_set in new_shuffled_sets]
            if original_answers != reshuffled_answers:
                different_order_found = True
                break
        if different_order_found:
            break

    assert different_order_found, "The shuffle did not produce a different order in 100 attempts."

