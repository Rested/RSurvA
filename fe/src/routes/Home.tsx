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

const QUESTION_TYPE = 'plaintext';

interface QuestionsProps {
    name: string;
}

interface Question {
    text: string;
    question_type: string;
}





const Questions = () => {
    const [surveyName, setSurveyName] = useState<string>("");

    const [questions, setQuestions] = useState<Question[]>([]);
    const [surveyDuration, setSurveyDuration] = useState<number>(60 * 24);
    const [surveyMinResponses, setSurveyMinResponses] = useState<number>(5);
    const [shareLinks, setShareLinks] = useState<{ link: string; privateKey: string, publicKey: string } | null>(null);

    const handleQuestionChange = (index: number, text: string ) => {
        setQuestions(questions.map((question, i) => (index === i ? { ...question, text } : question)));
    };

    const handleQuestionAdd = (questionType) => {
        setQuestions(questions.concat([{ text: "", question_type: questionType }]));
    };

    const handleSurveyNameChange = (event) => {
        setSurveyName(event.target.value);    
    };


    const handleShareSurvey = async () => {
        const {surveyId, privateKeyB64, publicKeyB64} = await generateRSA();
        fetch(`${apiUrl}/survey`, {
            body: JSON.stringify({ name: surveyName, questions, survey_id: surveyId, public_key: publicKeyB64, duration: surveyDuration, min_responses: surveyMinResponses }),
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
            })
    }
    return shareLinks ? <ShareLinks {...shareLinks} duration={durations[surveyDuration]} minResponses={surveyMinResponses} /> : (<div class="p-6 mt-8 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
        <TitleBar text={"Create An Anonymous Survey"}/>
        <Divider text="Create"/>
        <div className="mb-6">
            <label 
                htmlFor="survey-name" 
                className="block text-md font-medium text-gray-900 mb-2">
                Survey Name
            </label>
            <input
                id="survey-name"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="My Survey"
                onInput={handleSurveyNameChange}
                value={surveyName}
            />
        </div>

        {questions.map((question, index) => (
            <QuestionEntry index={index} onQuestionChange={handleQuestionChange} question={question} />
        ))}
        <QuestionButtons onAddQuestion={handleQuestionAdd}/>
        <Divider text="Preview"/>
        <div class="mb-4">
            <h2 class="text-xl font-bold text-gray-900 mb-4">{surveyName}</h2>
            <SurveyPreview questions={questions}/>
        </div>
        <Divider text="Share"/>
        <div class="mb-4">
            <label htmlFor="survey-duration" class="block text-sm font-medium leading-6 text-gray-900 mb-2">Survey Duration <small class="font-bold">(You won't be able to see the results till this is up - participants will be able to see this)</small></label>
            <select
                id="survey-duration"
                value={surveyDuration}
                onChange={(e) => setSurveyDuration(parseInt(e.target.value))}
                class="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
                {Object.entries(durations).map(([value, label]) => (
                    <option key={value} value={parseInt(value)}>
                        {label}
                    </option>
                ))}
            </select>
        </div>
        <div class="mb-4">
            <label htmlFor="survey-min-responses" class="block text-sm font-medium leading-6 text-gray-900 mb-2">Survey Responses <small>(You won't be able to see the results till this many answers are collected - participants can see this)</small></label>
            <input
                id="survey-min-responses"
                type="number"
                value={surveyMinResponses}
                onChange={(e) => setSurveyMinResponses(parseInt(e.target.value))}
                class="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
        <button
            onClick={handleShareSurvey}
            class="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
