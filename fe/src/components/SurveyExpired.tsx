import { Fragment } from "preact";
import { durations } from "../constants";
import { convertUTCToLocal } from "../time";

const SurveyExpired = ({ surveyQuestions, handleUnlockSurvey, setPrivateKey, privateKey }) => {
    return (
        <div class="p-4 rounded-lg shadow-md mb-4">
            <p class="text-gray-700 mb-2">This survey has finished!</p>
            {surveyQuestions?.encrypted_answers_sets ? (
                <Fragment>
                    <p class="text-gray-700 mb-2">If you are the survey owner, you may unlock it with your private key.</p>
                    <input
                        type="text"
                        placeholder="Enter your private key"
                        value={privateKey}
                        onChange={(e) => setPrivateKey(e.target.value)}
                        class="w-full px-4 py-2 mb-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-100 text-base-content"
                    />
                    <button
                        onClick={handleUnlockSurvey}
                        class="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Unlock Survey
                    </button>
                </Fragment>
            ) : (
                <p class="text-gray-700">
                    The survey expired after <strong class="font-semibold">{durations[surveyQuestions.duration]}</strong> (at <strong class="font-semibold">{convertUTCToLocal(surveyQuestions.expires_at)}</strong>) without receiving at least <strong class="font-semibold">{surveyQuestions.min_responses}</strong> responses.
                </p>
            )}
        </div>
    );
};

export default SurveyExpired;
