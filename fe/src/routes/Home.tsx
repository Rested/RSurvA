import { h } from 'preact';
import { useState } from 'preact/hooks';
import QuestionEntry from '../components/QuestionEntry';
import ShareLinks from '../components/ShareLinks';
import { durations } from '../constants';
import TitleBar from '../components/TitleBar';
import SurveyPreview from '../components/SurveyPreview';
import { generateRSA } from '../crypto';
import QuestionButtons from '../components/QuestionButtons';
import { Divider } from '../components/Divider';

const apiUrl = import.meta.env.VITE_API_URL;

type Question = {
    text: string;
    question_type: string;
};


const Questions = () => {
    const [surveyName, setSurveyName] = useState<string>("");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [surveyDuration, setSurveyDuration] = useState<number>(60 * 60 * 24);
    const [surveyMinResponses, setSurveyMinResponses] = useState<number>(5);
    const [shareLinks, setShareLinks] = useState<{ link: string; privateKey: string, publicKey: string } | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleQuestionChange = (index: number, text: string) => {
        setQuestions(questions.map((question, i) => (index === i ? { ...question, text } : question)));
    };

    const handleQuestionAdd = (questionType: string) => {
        setQuestions(questions.concat([{ text: "", question_type: questionType }]));
    };

    const handleSurveyNameChange = (event) => {
        setSurveyName(event.target.value);
    };

    const validateSurvey = () => {
        if (surveyName.trim().length < 1) {
            setValidationError("Survey title must be at least 1 character long.");
            return false;
        }

        if (questions.length === 0) {
            setValidationError("Survey must have at least one question.");
            return false;
        }

        for (const question of questions) {
            const trimmedText = question.text.trim();
            const questionMarkCount = (trimmedText.match(/\?/g) || []).length;
            if (questionMarkCount < 1 || trimmedText.length < 3) {
                setValidationError("Each question must contain at least a question mark and two other characters.");
                return false;
            }
        }

        setValidationError(null);
        return true;
    };

    const handleShareSurvey = async () => {
        if (!validateSurvey()) {
            return;
        }

        const { surveyId, privateKeyB64, publicKeyB64 } = await generateRSA();
        fetch(`${apiUrl}/survey`, {
            body: JSON.stringify({
                name: surveyName,
                questions,
                survey_id: surveyId,
                public_key: publicKeyB64,
                duration: surveyDuration,
                min_responses: surveyMinResponses
            }),
            method: "POST",
            headers: { "Content-Type": "application/json" },
        })
            .then((r) => {
                if (r.status === 201) {
                    setShareLinks({
                        link: `${window.location.origin}/survey/${surveyId}`,
                        privateKey: privateKeyB64,
                        publicKey: publicKeyB64
                    });
                }
            });
    };

    return shareLinks ? (
        <ShareLinks
            surveyName={surveyName}
            {...shareLinks}
            duration={durations[surveyDuration]}
            minResponses={surveyMinResponses}
        />
    ) : (
        <div class="p-6 mt-8 max-w-4xl mx-auto bg-base-200 shadow-lg rounded-lg">
            <TitleBar text="Create Survey" />
            <Divider text="Create" />
            <div className="mb-6">
                <label htmlFor="survey-name" className="block text-md font-medium text-base-content mb-2">
                    Survey Name
                </label>
                <input
                    id="survey-name"
                    className="block w-full px-4 py-2 input input-bordered"
                    placeholder="My Survey"
                    onInput={handleSurveyNameChange}
                    value={surveyName}
                />
            </div>
            {questions.map((question, index) => (
                <QuestionEntry
                    key={index}
                    index={index}
                    onQuestionChange={handleQuestionChange}
                    question={question}
                />
            ))}
            <QuestionButtons onAddQuestion={handleQuestionAdd} />
            {validationError && (
                <div className="text-red-500 mb-4">
                    {validationError}
                </div>
            )}
            <Divider text="Preview" />
            <div className="mb-4">
                <h2 className="text-xl font-bold text-base-content mb-4">
                    {surveyName}
                </h2>
                <SurveyPreview questions={questions} />
            </div>
            <Divider text="Share" />
            <div className="mb-4">
                <label htmlFor="survey-duration" className="label text-base-content mb-2">
                    Duration
                </label>
                <select
                    id="survey-duration"
                    value={surveyDuration}
                    onChange={(e) => setSurveyDuration(parseInt(e.target.value, 10))}
                    className="block w-full px-4 py-2 select select-bordered"
                >
                    {Object.entries(durations).map(([value, label]) => {
                        return (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        )
                    })}
                </select>
            </div>
            <div className="mb-4">
                <label htmlFor="survey-min-responses" className="label text-base-content mb-2">
                    Minimum Responses
                </label>
                <input
                    id="survey-min-responses"
                    type="number"
                    value={surveyMinResponses}
                    onChange={(e) => setSurveyMinResponses(parseInt(e.target.value, 10))}
                    className="block w-full px-4 py-2 input input-bordered"
                />
            </div>
            <div className="mb-4 text-sm text-base-content font-semibold">
                <p className="text-md mb-1">
                    You won't be able to see the results until these conditions are met.
                </p>
                <p className="text-md mb-1">
                    If enough responses are not received within the time limit then the survey will just expire and you will not be able to see
                    any responses. This is to protect respondent anonymity.
                </p>
                <p className="text-md">
                    Participants will be able to see these conditions when answering the survey.
                </p>
            </div>
            <button
                onClick={handleShareSurvey}
                className="w-full px-4 py-2 btn btn-primary text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition-transform duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-offset-2"
            >
                Share Survey
            </button>
        </div>
    );
};

const Home = () => {
    return (
        <div>
            <Questions />
        </div>
    );
};

export default Home;