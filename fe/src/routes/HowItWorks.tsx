import { useEffect } from 'preact/hooks';
import { Divider } from '../components/Divider';
import mermaid from 'mermaid';
import TitleBar from '../components/TitleBar';
import { KeyIcon, LockClosedIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';

const diagram = `sequenceDiagram
    participant Survey Owner
    participant Frontend
    participant Backend
    participant Respondent
    
    Survey Owner->>Frontend: Create New Survey (Enter Details, Add Questions)
    Frontend->>Frontend: Generate RSA Key Pair
    Frontend->>Backend: Store Survey Details and Public Key
    Frontend-->>Survey Owner: Display Private Key, Public Key, and Survey Link
    Survey Owner->>Survey Owner: Save Private Key Securely
    Survey Owner->Respondent: Share Survey Link
    
    Respondent->>Backend: Fetch Survey Details (Questions and Public Key)
    Backend-->>Respondent: Return Questions and Public Key
    
    Respondent->>Frontend: Submit Answers
    Frontend-->>Frontend: Encrypt Answers with Public Key
    Frontend->>Backend: Store Encrypted Answers
    
    Survey Owner->>Frontend: Check on survey
    Frontend->>Backend: Fetch Survey Details and Encrypted Answers
    Backend->>Backend: Check Conditions (Duration & Min Responses Met)
    Backend-->>Frontend: Return Encrypted Answers (If conditions met)
    
    Survey Owner-->>Frontend: Provide Private Key
    Frontend->Frontend: Decrypt Responses Using Private Key
    Frontend-->>Survey Owner: Decrypted Responses
`

const HowItWorks = () => {

    useEffect(() => {
        mermaid.initialize({ startOnLoad: true });
        mermaid.init();
    }, []);

    return (
        <div class="p-6 mt-8 max-w-4xl mx-auto bg-base-200 shadow-lg rounded-lg">
            <TitleBar text="How it Works"/>
            <div class="text-base-content text-lg font-semibold mb-4">
                <strong>Secure, Anonymous Surveys with End-to-End Encryption</strong>
            </div>
            <Divider text="Key Benefits" />
            <div class="mt-6">
                <ul class="list-inside list-disc text-base-content mt-4 space-y-4">
                    <li class="flex items-start">
                        <KeyIcon style="height: 24px; width: 24px;" class="text-success mr-2" />
                        <span>
                            <strong>Client-Side Encryption:</strong> Answers are encrypted with a public key on the client side before transmission, ensuring end-to-end privacy.
                        </span>
                    </li>
                    <li class="flex items-start">
                        <ShieldCheckIcon style="height: 24px; width: 30px;" class="text-success mr-2" />
                        <span>
                            <strong>Conditional Access:</strong> Survey responses are accessible only after the survey duration has ended and the minimum response threshold is met, helping to achieve participant anonymity.
                        </span>
                    </li>
                    <li class="flex items-start">
                        <LockClosedIcon style="height: 24px; width: 24px;" class="text-success mr-2" />
                        <span>
                            <strong>Private Key Decryption:</strong> Encrypted answers can only be unlocked by the survey owner after the survey has completed using a private key only they have access to.
                        </span>
                    </li>
                </ul>
            </div>

            <Divider text="How To Create A Survey" />
            <div class="mb-6">
                <h2 class="text-xl font-semibold text-base-content mb-2">1. Create An Anonymous Survey</h2>
                <p class="text-base-content">
                    Start by creating a new survey. Enter a name for your survey and add as many questions
                    as you like. The questions can be edited at any time before sharing the survey.
                </p>
            </div>
            <div class="mb-6">
                <h2 class="text-xl font-semibold text-base-content mb-2">2. Customize Survey Settings</h2>
                <p class="text-base-content">
                    Choose the duration for which the survey will be active and set a minimum number of responses
                    required before the survey results are available.
                </p>
            </div>
            <div class="mb-6">
                <h2 class="text-xl font-semibold text-base-content mb-2">3. Share Your Survey</h2>
                <p class="text-base-content">
                    As people start answering your survey, their responses will be saved encrypted on the server using the public key corresponding to the private key you saved earlier.
                    Responses will not be available for you to decrypt until the survey duration and minimum response count conditions are met to help ensure respondent anonymity.
                </p>
            </div>
            <div class="mb-6">
                <h2 class="text-xl font-semibold text-base-content mb-2">5. View Results</h2>
                <p class="text-base-content">
                    After the survey duration has passed and if the minimum responses requirement is met,
                    you will be able to decrypt the collected answers using the private key you saved earlier.
                </p>
            </div>
            <Divider text="Technical Details" />
            <div class="mb-6">
                <h3 class="text-lg font-semibold text-base-content mt-4">Step-by-Step Sequences</h3>
                <ul class="list-inside list-disc text-base-content mt-2">
                    <li><strong>Create Survey:</strong> The survey owner creates a new survey by entering the details and questions.</li>
                    <li><strong>Generate Keys:</strong> The frontend generates an RSA key pair (public and private keys).</li>
                    <li><strong>Store Survey Details:</strong> The survey details and the public key are stored on the backend.</li>
                    <li><strong>Save Private Key:</strong> The frontend displays the private key, public key, and survey link to the survey owner who must save the private key securely.</li>
                    <li><strong>Share Survey Link:</strong> The survey owner shares the generated survey link with respondents.</li>
                    <li><strong>Fetch Survey Details:</strong> Respondents fetch survey questions and the public key from the backend.</li>
                    <li><strong>Submit Answers:</strong> Respondents submit their answers; the frontend encrypts the answers using the public key before sending them to the backend.</li>
                    <li><strong>Store Encrypted Answers:</strong> The encrypted answers are stored on the backend securely.</li>
                    <li><strong>Check Survey Status:</strong> The survey owner checks the survey status. The backend checks if the survey duration and minimum response count conditions are met.</li>
                    <li><strong>Return Encrypted Answers:</strong> If conditions are met, the backend returns the encrypted answers to the frontend.</li>
                    <li><strong>Decrypt Responses:</strong> The survey owner provides the private key to the frontend, which then decrypts the responses and displays them.</li>
                </ul>
            </div>
            <h3 class="text-lg font-semibold text-base-content mt-2 mb-4">Sequence Diagram</h3>
            <div class="mermaid mx-auto max-w-xl bg-white p-6 rounded-lg shadow-md">
                {diagram}
            </div>
            <div class="mb-6">
                <h3 class="text-xl font-semibold text-base-content mb-2">Infrastructure</h3>
                <p class="text-base-content">
                    Since encryption happens on the frontend, we use <a href="https://pages.github.com/" class="text-primary hover:underline">GitHub Pages</a> to make it easy to audit the code being used.
                </p>
                <p class="text-base-content">
                    The backend source is also available and is deployed on <a href="https://fly.io/" class="text-primary hover:underline">Fly.io</a>. The encrypted answer data and unencrypted question data are stored on <a href="https://fly.io/docs/reference/redis/" class="text-primary hover:underline">Fly Upstash</a> redis instances.
                </p>
            </div>
        </div>
    );
};

export default HowItWorks;
