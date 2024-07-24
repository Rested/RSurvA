import { Fragment } from "preact";
import { useState } from "preact/hooks";
import { durations } from "../constants";
import { convertUTCToLocal } from "../time";

const SurveyExpired = ({ surveyQuestions, handleUnlockSurvey, setPrivateKey, privateKey }) => {


    return (
        <div>
            <p>This survey has finished!</p>
            {surveyQuestions?.encrypted_answers_sets ? (
                <Fragment>
                    <p>If you are the survey owner you may unlock it with your private key.</p>
                    <input
                        type="text"
                        placeholder="Enter your private key"
                        value={privateKey}
                        onChange={(e) => setPrivateKey(e.target.value)}
                    />
                    <button onClick={handleUnlockSurvey}>Unlock Survey</button>
                </Fragment>
            ) : (
                <p>The survey expired after {durations[surveyQuestions.duration]} (at {convertUTCToLocal(surveyQuestions.expires_at)}) without receiving at least {surveyQuestions.min_responses} responses.</p>
            )}
        </div>
    );
};

export default SurveyExpired;
