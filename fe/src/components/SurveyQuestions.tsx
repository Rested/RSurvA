import QuestionAnswer from "./QuestionAnswer";
import QuestionAnswerSet from "./QuestionAnswerSet";
import { durations } from "../constants";
import { Fragment } from "preact/jsx-runtime";
import { convertUTCToLocal } from "../time";
import { ShieldCheckIcon } from "@heroicons/react/24/solid";
import { useState } from "preact/hooks";

const SurveyQuestions = ({ surveyQuestions, surveyQuestionAnswers, surveyDecryptedAnswers, handleAnswerChange, submitAnswers }) => {
    const [validationError, setValidationError] = useState<string | null>(null);

    const validateAnswers = () => {
        for (const answer of surveyQuestionAnswers) {
            if (!answer){
                setValidationError("All questions must be answered before submitting.");
                return false;
            }
        }

        setValidationError(null);
        return true;
    };

    const handleSubmit = () => {
        if (validateAnswers()) {
            submitAnswers();
        }
    };

    return (
        <div class="p-4 rounded-lg shadow-md mb-4">
            <h2 class="text-xl font-bold text-base-content mb-4">{surveyQuestions.name}</h2>
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
                } 
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
                
            })}
            {validationError && (
                <div className="text-red-500 mb-4">
                    {validationError}
                </div>
            )}

            {surveyQuestions?.encrypted_answers_sets ? (
                <p class="text-base-content mt-4">
                    You will be able to view these results until <strong class="font-semibold">{convertUTCToLocal(surveyQuestions.results_available_till)}</strong>
                </p>
            ) : (
                <Fragment>
                    
                    <div class="mt-4 p-4 border-l-4 border-gray-500 dark:bg-gray-800 text-base-content rounded">
                        <div class="flex items-center mb-2">
                            <ShieldCheckIcon class="h-5 w-5 text-gray-500 mr-2" />
                            <h3 class="text-lg font-semibold">Anonymity and Privacy</h3>
                        </div>
                        <p class="mt-2">
                            Answers are stored encrypted and can only be decrypted by the survey owner
                            after <strong class="font-semibold">{durations[surveyQuestions.duration]}</strong> (<strong class="font-semibold">{convertUTCToLocal(surveyQuestions.expires_at)}</strong>)
                            and the survey has received at least <strong class="font-semibold">{surveyQuestions.min_responses}</strong> responses.
                        </p>
                        <p class="mt-2">
                            You should only answer surveys which you know have been shared with others as the owner could (if they were evil) add fake responses so that the threshold of <strong class="font-semibold">{surveyQuestions.min_responses}</strong> responses was exceeded.
                        </p>
                        <p class="mt-2">
                            The duration limit could only be manipulated if they controlled the server (and were evil). You can audit the server code on <a href="https://github.com/rested/rsurva">github</a>.
                        </p>
                        <p class="mt-2">
                            The public key your answers are encrypted with is:
                        </p>
                        <input
                            type="text"
                            value={surveyQuestions.public_key}
                            readOnly
                            class="flex-grow px-4 py-2 input input-bordered dark:bg-black w-full mt-2"
                            />
                        <p class="mt-2">
                            You can confirm this with the survey owner if you want to be sure that the server hasn't tampered with it!
                        </p>
                    </div>
                    <button
                        onClick={handleSubmit}
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
