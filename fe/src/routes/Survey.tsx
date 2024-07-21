import { useEffect, useState } from "preact/hooks";
import QuestionAnswer from "../components/QuestionAnswer";
import QuestionAnswerSet from "../components/QuestionAnswerSet";
import { Fragment } from "preact/jsx-runtime";


const apiUrl = import.meta.env.VITE_API_URL;

async function encryptStringWithPublicKey(publicKeyB64, stringToEncrypt) {
    // Convert base64 public key to ArrayBuffer
    function base64ToArrayBuffer(base64) {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    // Import the public key
    async function importPublicKey(base64PublicKey) {
        const publicKeyBuffer = base64ToArrayBuffer(base64PublicKey);
        const publicKey = await window.crypto.subtle.importKey(
            "spki",
            publicKeyBuffer,
            {
                name: "RSA-OAEP",

                hash: "SHA-256",
            },
            true,
            ["encrypt"]
        );
        return publicKey;
    }

    // Encrypt the string
    async function encryptData(publicKey, data) {
        const encodedData = new TextEncoder().encode(data);
        const encryptedData = await window.crypto.subtle.encrypt(
            {
                name: "RSA-OAEP"
            },
            publicKey,
            encodedData
        );
        return encryptedData;
    }

    // Base64 encode the ArrayBuffer
    function arrayBufferToBase64(buffer) {
        const binaryString = String.fromCharCode(...new Uint8Array(buffer));
        return window.btoa(binaryString);
    }

    // Main logic
    const publicKey = await importPublicKey(publicKeyB64);
    const encryptedData = await encryptData(publicKey, stringToEncrypt);
    const encryptedDataB64 = arrayBufferToBase64(encryptedData);

    return encryptedDataB64;
}

async function decryptStringWithPrivateKey(privateKeyB64, stringToDecrypt) {
    function base64ToArrayBuffer(base64) {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    async function importPrivateKey(base64PrivateKey) {
        const privateKeyBuffer = base64ToArrayBuffer(base64PrivateKey);
        const privateKey = await window.crypto.subtle.importKey(
            "pkcs8",
            privateKeyBuffer,
            {
                name: "RSA-OAEP",
                hash: "SHA-256",
            },
            true,
            ["decrypt"]
        );
        return privateKey;
    }

    async function decryptData(privateKey, data) {
        const decryptedData = await window.crypto.subtle.decrypt(
            {
                name: "RSA-OAEP",
            },
            privateKey,
            data
        );
        return new TextDecoder().decode(decryptedData);
    }

    const privateKey = await importPrivateKey(privateKeyB64.trim());
    const decryptedData = await decryptData(privateKey, base64ToArrayBuffer(stringToDecrypt));
    return decryptedData;
}



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
            .then((r) => r.json())
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
    const handleUnlockSurvey = async () => {
        try {
            const decryptedAnswersPromises = surveyQuestions.encrypted_answers_sets.map(async (encryptedAnswers) => {
                const decryptedAnswersJSON = await decryptStringWithPrivateKey(privateKey, encryptedAnswers);
                return JSON.parse(decryptedAnswersJSON);
            });

            const decryptedAnswers = await Promise.all(decryptedAnswersPromises);
            console.log(decryptedAnswers)
            setDecryptedAnswers(decryptedAnswers);
        } catch (error) {
            console.error("Error decrypting answers:", error);
        }
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


    return (submitted ? <h1>Thank you for your response!</h1> : (
        <div>
            <h1>Survey{decryptedAnswers ? ' Responses' : ''}</h1>
            {surveyQuestions?.encrypted_answers_sets && decryptedAnswers === null ? (
                <div>
                    <p>This survey has finished! You may unlock it with your private key</p>
                    <input
                        type="text"
                        placeholder="Enter your private key"
                        value={privateKey}
                        onChange={(e) => setPrivateKey(e.target.value)}
                    />
                    <button onClick={handleUnlockSurvey}>Unlock Survey</button>
                </div>
            ) : null}
            {surveyQuestions ? (<div>
                <h2>{surveyQuestions.name}</h2>
                {surveyQuestions.questions.map((q, i) => {
                    if (surveyQuestions?.encrypted_answers_sets) {
                        let answers = []
                        if (decryptedAnswers) {
                            answers = decryptedAnswers.map(as => as[i]);
                        }
                        return <QuestionAnswerSet question_type={q.question_type} text={q.text} index={i} answers={answers} />
                    } else {
                        return <QuestionAnswer question_type={q.question_type} text={q.text} index={i} value={surveyQuestionAnswers[i]} onChange={handleAnswerChange} />
                    }
                })}
                {surveyQuestions?.encrypted_answers_sets ? null : <Fragment>
                    <p>Answers are stored encrypted and can only be decrypted by the survey owner after { }</p>
                    <button onClick={submitAnswers}>Submit Answers</button></Fragment>}
            </div>) : null}
        </div>
    ));
};

export default Survey;
