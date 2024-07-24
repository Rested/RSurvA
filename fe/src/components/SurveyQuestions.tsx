import QuestionAnswer from "./QuestionAnswer";
import QuestionAnswerSet from "./QuestionAnswerSet";
import { durations } from "../constants";
import { Fragment } from "preact/jsx-runtime";
import { convertUTCToLocal } from "../time";


const SurveyQuestions = ({ surveyQuestions, surveyQuestionAnswers, surveyDecryptedAnswers, handleAnswerChange, submitAnswers }) => {
    return (
        <div>
            <h2>{surveyQuestions.name}</h2>
            {surveyQuestions.questions.map((q, i) => {
                if (surveyQuestions?.encrypted_answers_sets) {
                    let answers = surveyQuestions?.encrypted_answers_sets;
                    let questionType = "encrypted";
                    if (surveyDecryptedAnswers) {
                        answers = surveyDecryptedAnswers.map(as => as[i]);
                        questionType = q.question_type;
                    }
                    return (
                        <QuestionAnswerSet key={i} question_type={questionType} text={q.text} index={i} answers={answers} />
                    );
                } else {
                    return (
                        <QuestionAnswer key={i} question_type={q.question_type} text={q.text} index={i} value={surveyQuestionAnswers[i]} onChange={handleAnswerChange} />
                    );
                }
            })}
            {surveyQuestions?.encrypted_answers_sets ? (
                <p>You will be able to view these results until {convertUTCToLocal(surveyQuestions.results_available_till)}</p>
            ) : (
                <Fragment>
                    <p>Answers are stored encrypted and can only be decrypted by the survey owner after {durations[surveyQuestions.duration]} ({convertUTCToLocal(surveyQuestions.expires_at)}) and the survey has received at least {surveyQuestions.min_responses} responses.</p>
                    <p>The public key your answers are encrypted with is `{surveyQuestions.public_key}`. You can check this with the survey asker if you want to verify.</p>
                    <button onClick={submitAnswers}>Submit Answers</button>
                </Fragment>
            )}
        </div>
    );
};

export default SurveyQuestions;