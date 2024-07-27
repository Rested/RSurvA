import { useEffect, useState } from "preact/hooks";
import QuestionAnswer from "../components/QuestionAnswer";
import QuestionAnswerSet from "../components/QuestionAnswerSet";
import { Fragment } from "preact/jsx-runtime";
import { durations } from "../constants";
import { decryptStringWithPrivateKey, encryptStringWithPublicKey } from "../crypto";
import SurveyQuestions from "../components/SurveyQuestions";
import SurveyExpired from "../components/SurveyExpired";
import TitleBar from "../components/TitleBar";


const apiUrl = import.meta.env.VITE_API_URL;





const Survey = ({ surveyId }) => {
    const [surveyQuestions, setSurveyQuestions] = useState(null);
    const [surveyQuestionAnswers, setSurveyQuestionAnswers] = useState(null);
    const [privateKey, setPrivateKey] = useState("");
    const [decryptedAnswers, setDecryptedAnswers] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        fetch(`${apiUrl}/survey/${encodeURIComponent(surveyId)}`, {
            method: "GET",
        })
            .then((r) => {
                if (r.status === 200) {
                    return r.json()
                }
                window.location.href = `${window.location.origin}/not-found`
            })
            .then((rj) => {
                setSurveyQuestions(rj);
                setSurveyQuestionAnswers(rj.questions.map(() => null))
            });

    }, []);
    const handleAnswerChange = (index, value) => {
        const answers = [...surveyQuestionAnswers];
        answers[index] = value;
        setSurveyQuestionAnswers(answers);
    };

    const submitAnswers = async () => {
        const encryptedAnswers = await encryptStringWithPublicKey(surveyQuestions.public_key, JSON.stringify(surveyQuestionAnswers));
        fetch(`${apiUrl}/survey/${surveyId}/answer`, {
            body: JSON.stringify({ encrypted_answers: encryptedAnswers }),
            method: "POST",
            headers: { "Content-Type": "application/json" },
        }).then(r => {
            if (r.status === 201) {
                setSubmitted(true);
            }
        })
    }
    const handleUnlockSurvey = async () => {
        try {
            const decryptedAnswersPromises = surveyQuestions.encrypted_answers_sets.map(async (encryptedAnswers) => {
                const decryptedAnswersJSON = await decryptStringWithPrivateKey(privateKey, encryptedAnswers);
                return JSON.parse(decryptedAnswersJSON);
            });
            const decryptedAnswers = await Promise.all(decryptedAnswersPromises);
            setDecryptedAnswers(decryptedAnswers);
        } catch (error) {
            console.error("Error decrypting answers:", error);
        }
    };


    const hasAnswersOrNeedsQuestions = surveyQuestions && (!surveyQuestions.is_expired || surveyQuestions.is_expired && surveyQuestions.encrypted_answers_sets);


    return (
        submitted ? 
        <div class="p-6 mt-8 max-w-4xl mx-auto bg-base-200 shadow-lg rounded-lg">
            <h1 class="text-lg font-medium text-base-content mb-4">Thank you for your response!</h1>
        </div> 
        : 
        <div class="p-6 mt-8 max-w-4xl mx-auto bg-base-200 shadow-lg rounded-lg">
            <TitleBar text={surveyQuestions?.is_expired ? 'Survey Responses' : 'Respond to Survey'}/>
            {surveyQuestions?.is_expired && decryptedAnswers === null ? 
                <SurveyExpired
                    surveyQuestions={surveyQuestions}
                    handleUnlockSurvey={handleUnlockSurvey}
                    setPrivateKey={setPrivateKey}
                    privateKey={privateKey}
                /> 
                : null
            }
            {hasAnswersOrNeedsQuestions ? 
                <SurveyQuestions
                    surveyQuestions={surveyQuestions}
                    surveyDecryptedAnswers={decryptedAnswers}
                    surveyQuestionAnswers={surveyQuestionAnswers}
                    handleAnswerChange={handleAnswerChange}
                    submitAnswers={submitAnswers}
                /> : null
            }
        </div>
    );


};

export default Survey;
