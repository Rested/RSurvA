import { h } from 'preact';
import { useState } from 'preact/hooks';
import QuestionEntry from '../components/QuestionEntry';
import ShareLinks from '../components/ShareLinks';
import { durations } from '../constants';


const apiUrl = import.meta.env.VITE_API_URL;

const QUESTION_TYPE = 'plaintext';

interface QuestionsProps {
    name: string;
}

interface Question {
    text: string;
    question_type: string;
}

async function computeSHA256HexOfBase64(base64String) {
    const binaryString = atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    const hashBuffer = await crypto.subtle.digest("SHA-256", bytes);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
}




const Questions = () => {
    const [surveyName, setSurveyName] = useState<string>("");

    const [questions, setQuestions] = useState<Question[]>([]);
    const [surveyDuration, setSurveyDuration] = useState<number>(60 * 24);
    const [surveyMinResponses, setSurveyMinResponses] = useState<number>(5);
    const [shareLinks, setShareLinks] = useState<{ link: string; privateKey: string, publicKey: string } | null>(null);

    const handleQuestionChange = (index: number, text: string) => {
        setQuestions(questions.map((question, i) => (index === i ? { ...question, text } : question)));
    };

    const handleQuestionAdd = () => {
        setQuestions(questions.concat([{ text: "", question_type: QUESTION_TYPE }]));
    };

    const handleSurveyNameChange = ({ target: { value } }: { target: { value: string } }) => {
        setSurveyName(value);
    };


    const handleShareSurvey = async () => {
        const rsaKeyPair = await window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: "SHA-256",
            },
            true,
            ["encrypt", "decrypt"]
        );
        const publicKey = await window.crypto.subtle.exportKey("spki", rsaKeyPair.publicKey);
        const privateKey = await window.crypto.subtle.exportKey("pkcs8", rsaKeyPair.privateKey);
        const publicKeyB64 = btoa(String.fromCharCode(...new Uint8Array(publicKey)));
        const privateKeyB64 = btoa(String.fromCharCode(...new Uint8Array(privateKey)));
        const surveyId = await computeSHA256HexOfBase64(publicKeyB64);

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
        <h1 class="text-3xl font-bold text-center mb-6 text-gray-900">Create an anonymous survey with public key encryption!</h1>
        <div class="mb-4">
            <label htmlFor="survey-name" class="block text-sm font-medium leading-6 text-gray-900 mb-2">Survey Name</label>
            <input
                id="survey-name"
                class="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="My Survey"
                onChange={handleSurveyNameChange}
                value={surveyName}
            />
        </div>
        {questions.map((question, index) => (
            <QuestionEntry index={index} onQuestionChange={handleQuestionChange} question={question} />
        ))}
        <button
            onClick={handleQuestionAdd}
            class="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
            Add Question
        </button>
        <hr class="my-6" />
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
