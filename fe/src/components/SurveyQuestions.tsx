import QuestionAnswer from "./QuestionAnswer";
import QuestionAnswerSet from "./QuestionAnswerSet";
import { durations } from "../constants";
import { Fragment } from "preact/jsx-runtime";
import { convertUTCToLocal } from "../time";

const SurveyQuestions = ({ surveyQuestions, surveyQuestionAnswers, surveyDecryptedAnswers, handleAnswerChange, submitAnswers }) => {
    return (
        <div class="p-4 bg-white rounded-lg shadow-md mb-4">
            <h2 class="text-xl font-bold text-gray-900 mb-4">{surveyQuestions.name}</h2>
            {surveyQuestions.questions.map((q, i) => {
                if (surveyQuestions?.encrypted_answers_sets) {
                    let answers = surveyQuestions?.encrypted_answers_sets;
                    let questionType = "encrypted";
                    if (surveyDecryptedAnswers) {
                        answers = surveyDecryptedAnswers.map(as => as[i]);
                        questionType = q.question_type;
                    }
                    return (
                        <QuestionAnswerSet
                            key={i}
                            question_type={questionType}
                            text={q.text}
                            index={i}
                            answers={answers}
                        />
                    );
                } else {
                    return (
                        <QuestionAnswer
                            key={i}
                            question_type={q.question_type}
                            text={q.text}
                            index={i}
                            value={surveyQuestionAnswers[i]}
                            onChange={handleAnswerChange}
                        />
                    );
                }
            })}
            {surveyQuestions?.encrypted_answers_sets ? (
                <p class="text-gray-700 mt-4">
                    You will be able to view these results until <strong class="font-semibold">{convertUTCToLocal(surveyQuestions.results_available_till)}</strong>
                </p>
            ) : (
                <Fragment>
                    <p class="text-gray-700 mt-4">
                        Answers are stored encrypted and can only be decrypted by the survey owner after <strong class="font-semibold">{durations[surveyQuestions.duration]}</strong> (<strong class="font-semibold">{convertUTCToLocal(surveyQuestions.expires_at)}</strong>) and the survey has received at least <strong class="font-semibold">{surveyQuestions.min_responses}</strong> responses.
                    </p>
                    <p class="text-gray-700 mt-2">
                        The public key your answers are encrypted with is <code class="bg-gray-100 p-1 rounded">{surveyQuestions.public_key}</code>. You can check this with the survey asker if you want to verify.
                    </p>
                    <button
                        onClick={submitAnswers}
                        class="w-full mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Submit Answers
                    </button>
                </Fragment>
            )}
        </div>
    );
};

export default SurveyQuestions;
