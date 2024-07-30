import { useEffect } from 'preact/hooks';
import { Divider } from '../components/Divider';
import mermaid from 'mermaid';
import TitleBar from '../components/TitleBar';
import { KeyIcon, LockClosedIcon, ShieldCheckIcon, CodeBracketIcon } from '@heroicons/react/24/solid';
import { adversarialStylometryPrompt } from '../prompts';

const diagram = `sequenceDiagram
    participant Survey Owner
    participant Frontend
    participant Backend
    participant Respondent

    Survey Owner->>Frontend: Create New Survey (Enter Details, Add Questions)
    Frontend->>Frontend: Generate RSA Key Pair
    Frontend->>Backend: Store Survey Details and Public Key
    Frontend->Survey Owner: Display Private Key, Public Key, and Survey Link
    Survey Owner->Survey Owner: Save Private Key Securely
    Survey Owner->>Respondent: Share Survey Link

    Respondent->>Frontend: Access Survey Link
    Frontend->>Backend: Fetch Survey Details (Questions and Public Key)
    Backend->>Frontend: Return Questions and Public Key
    Frontend->Respondent: Display Questions

    Respondent->Frontend: Submit Answers
    Frontend->>Frontend: Encrypt Answers with Public Key
    Frontend->>Backend: Store Encrypted Answers

    Survey Owner->>Frontend: Check on survey
    Frontend->>Backend: Fetch Survey Details and Encrypted Answers
    Backend->>Backend: Check Conditions (Duration & Min Responses Met)
    Backend-->>Frontend: Return Encrypted Answers (If conditions met)

    Survey Owner->>Frontend: Provide Private Key
    Survey Owner->Frontend: Request Decryption
    Frontend->Frontend: Decrypt Responses Using Private Key
    Frontend->>Survey Owner: Decrypted Responses`;

const infrastructureDiagram = `
graph LR
  G[GitHub Repository]
  F[Frontend deployed on Cloudflare Pages]
  B[Backend deployed on Fly.io]
  R[Redis on Fly Upstash]

  G -- deploys to --> F
  G -- deploys to --> B
  F -- API Calls --> B
  B -- stores data in --> R

  style G fill:#bbf,stroke:#333,stroke-width:2px
  style F fill:#f9f,stroke:#333,stroke-width:2px
  style B fill:#bfb,stroke:#333,stroke-width:2px
  style R fill:#fbf,stroke:#333,stroke-width:2px
`;


const examplePromptQ = "Are birds real?";
const examplePromptA = "Nah birds ain't real";

const HowItWorks = () => {

    useEffect(() => {
        mermaid.initialize({ startOnLoad: true });
        mermaid.init();
    }, []);

    return (
        <div class="p-6 mt-8 max-w-4xl mx-auto bg-base-200 shadow-lg rounded-lg">
            <TitleBar text="How it Works" />
            <div class="text-base-content text-lg font-semibold mb-4">
                <strong>Really Super Anonymous Surveys</strong>
                <p>
                    Surveys which claim to be anonymous often are not.

                    RSurvA tries to do anonymous surveys better.
                </p>
            </div>
            <Divider text="Contents" id="contents" />
            <div class="mt-6">
                <ul class="list-inside list-disc text-base-content mt-4 space-y-4">
                    <li><a href="#key-benefits" class="text-primary hover:underline">Key Benefits</a></li>
                    <li><a href="#how-to-create-a-survey" class="text-primary hover:underline">Motivations</a></li>
                    <li><a href="#how-to-create-a-survey" class="text-primary hover:underline">How To Create A Survey</a></li>
                    <li><a href="#sequence-diagram" class="text-primary hover:underline">Sequence Diagram</a></li>
                    <li><a href="#limits-and-mitigations" class="text-primary hover:underline">Limitations & Mitigations</a></li>
                    <li><a href="#infrastructure" class="text-primary hover:underline">Infrastructure</a></li>
                </ul>
            </div>

            <Divider text="Key Benefits" id="key-benefits" />
            <div class="mt-6">
                <ul class="list-inside list-disc text-base-content mt-4 space-y-4">
                    <li class="flex items-start">
                        <KeyIcon style="height: 24px; width: 24px;" class="text-success mr-2" />
                        <span>
                            <strong>Client-Side Encryption:</strong> Answers are encrypted with an <b>RSA</b> public key on the client side before transmission, meaning they are stored encrypted on the server, keeping answers private.
                        </span>
                    </li>
                    <li class="flex items-start">
                        <ShieldCheckIcon style="height: 24px; width: 30px;" class="text-success mr-2" />
                        <span>
                            <strong>Conditional Access:</strong> Survey responses are accessible only after the survey duration has ended and the minimum response threshold is met, enabling participant anonymity.
                        </span>
                    </li>
                    <li class="flex items-start">
                        <LockClosedIcon style="height: 24px; width: 24px;" class="text-success mr-2" />
                        <span>
                            <strong>Private Key Decryption:</strong> Encrypted answers can only be unlocked by the survey owner after the survey duration has completed using a private key only they have access to.
                        </span>
                    </li>
                    <li class="flex items-start">
                        <CodeBracketIcon style="height: 24px; width: 24px;" class="text-success mr-2" />
                        <span>
                            <strong>Open Source:</strong> This project is open-source, which means it is auditable and can be self-hosted. Check out the code on <a href="https://github.com/rested/RSurvA" class="text-primary" target="_blank" rel="noopener noreferrer">GitHub</a>.
                        </span>
                    </li>

                </ul>
            </div>
            <Divider text="Motivations" id="motivations" />
            <div class="mt-6">
                <p>Surveys which claim to be anonymous often are not.</p>
                <ul class="list-inside list-disc text-base-content mt-4 space-y-4">
                    <li>They often require login, meaning the server knows exactly who provided which answer.</li>
                    <li>They may well store answers unencrypted, making them viewable by any entity with access to the server.</li>
                    <li>They often allow survey owners to see responses as they come in, making correlating them to when respondents saw the survey link possible.</li>
                    <li>They also offer no stylometry counter-measures (to stop the survey owner from identifying respondents using stylometry).</li>
                    <li>Finally, they often do nothing to randomize responses, making it easier to identify respondents by viewing all their answers at once and applying stylometry or other information on this broader dataset.</li>
                </ul>
                <p class="text-base-content mt-4">
                    RSurvA attempts to address all of these issues by providing a simple low trust approach.
                    See the <a href="#limits-and-mitigations" class="text-primary hover:underline">Limitations & Mitigations</a> section for details on how.
                </p>

            </div>
            <Divider text="How To Create A Survey" id="how-to-create-a-survey" />
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
                <h2 class="text-xl font-semibold text-base-content mb-2">4. View Results</h2>
                <p class="text-base-content">
                    After the survey duration has passed and if the minimum responses requirement is met,
                    you will be able to decrypt the collected answers using the private key you saved earlier.
                </p>
            </div>
            <Divider text="Sequence Diagram" id="sequence-diagram" />
            <div class="mermaid mx-auto max-w-xl bg-white p-6 rounded-lg shadow-md" id="sequence-diagram-mermaid">
                {diagram}
            </div>
            <Divider text="Limitations & Mitigations" id="limits-and-mitigations" />
            <div class="mb-6" id="limits-and-mitigations">
                <article class="prose lg:prose-xl text-base-content">
                    <ul class="list-disc pl-5">
                        <li class="mb-4">
                            <p>
                                <strong id="answers-across-questions">Limitation: Identifying Respondent Through Answers Across Questions</strong> - The survey owner may attempt to look at answers across questions to uncover the respondent's identity.
                            </p>
                            <p><strong>Possible mitigation:</strong> Do nothing if each question's answers are sufficiently anonymous.</p>
                            <p><strong>Chosen mitigation:</strong> Shuffle the encrypted answers (on a per question basis) on the server before sending them to the survey answerer.</p>
                            <div class="pl-5">
                                <p>So real answers:</p>
                                <p>1. What is your favourite colour?<br />
                                    &nbsp;&nbsp;&nbsp;* green<br />
                                    &nbsp;&nbsp;&nbsp;* blue<br />
                                    2. What letter does your favourite colour begin with?<br />
                                    &nbsp;&nbsp;&nbsp;* g<br />
                                    &nbsp;&nbsp;&nbsp;* b
                                </p>
                                <p>Becomes (in one permutation):</p>
                                <p>1. What is your favourite colour?<br />
                                    &nbsp;&nbsp;&nbsp;* blue<br />
                                    &nbsp;&nbsp;&nbsp;* green<br />
                                    2. What letter does your favourite colour begin with?<br />
                                    &nbsp;&nbsp;&nbsp;* g<br />
                                    &nbsp;&nbsp;&nbsp;* b
                                </p>
                            </div>
                        </li>

                        <li class="mb-4">
                            <p>
                                <strong>Limitation: Stylometric Analysis</strong> - The survey owner may attempt{' '}
                                <a href="https://en.wikipedia.org/wiki/Stylometry" class="text-primary">stylometric</a> analysis to determine who said what. References to particular people or events may reveal the respondent's identity.
                            </p>
                            <p><strong>Possible mitigations:</strong></p>
                            <ul class="list-disc pl-5">
                                <li>LLMs can transform text to be sound, safe, and sensible (criteria described <a href="https://en.wikipedia.org/wiki/Adversarial_stylometry" class="text-primary">here</a>), but running these in the browser is currently problematic due to limited WebGPU support.</li>
                                <li>Using third-party networks like huggingface for model serving introduces hosting costs and dependencies.</li>
                            </ul>
                            <p><strong>Chosen mitigation:</strong> Allow the user to click on a button which provides a prompt they can use with an LLM they trust to transform their answer. If some BYOLLM (bring
                                your own LLM) apis become available, this should shift to use them.</p>
                            <p>
                                The prompt for the question "{examplePromptQ}" and answer "{examplePromptA}" is as follows:
                                <code class="block p-2 mt-2 rounded whitespace-pre-line">{adversarialStylometryPrompt({ question: examplePromptQ, answer: examplePromptA })}</code>
                                This gives <i>No, birds do not exist.</i> in gpt-4o
                            </p>
                        </li>

                        <li class="mb-4">
                            <p>
                                <strong>Limitation: Survey Owner Controlling Backend</strong> - If the survey owner controls the backend, they could retrieve the answers at any point after survey creation using both the private key (as the survey owner) and the encrypted answers (as the server/backend controller).
                            </p>
                            <p><strong>Possible mitigations:</strong> Timelock encryption would be a fairly nice way to remove this trust on the server owner, but it is a fairly hard problem (<a href="https://gwern.net/self-decrypting" class="text-primary">gwern has a good write up</a>). The most viable implementation would be <a href="https://github.com/drand/tlock-js" class="text-primary">tlock-js</a>, which would avoid this server owner trust at the expense of introducing a 3rd party network dependency.</p>

                            <p><strong>Chosen mitigation:</strong> While tlock-js could be viable, it introduces a networked 3rd party dependency that needs to be accessible and not compromised when the respondent encrypts or the
                                survey owner attempts to decrypt. Early decryption has the same risks as the <a href="#min-resp-faking" class="underline">minimum response threshold faking</a> and benefits from the same mitigations.
                                The difference is it has a slightly stronger condition in that there is a timing element. <span id="timing-attacks">For example, if the survey is posted to a public channel and it's known that the public channel will only be viewed from 10 am by Alice and from 12 pm by Bob, then an answer decrypted at 11 am is likely from Alice.</span> This can also bypass mitigations around question correlation.
                                For this reason we strengthen the advise to the user to checking that at least the minimum responses number of users are likely to have seen the message at that time.
                            </p>
                            <p>That said, contributions for optional usage of tlock-js would be welcomed on the <a href="https://github.com/rested/RSurvA" class="text-primary" target="_blank" rel="noopener noreferrer">GitHub</a>!
                            </p>
                        </li>
                        <li class="mb-4">
                            <p>
                                <strong>Limitation: Questions Stored Unencrypted</strong> - The backend stores the questions unencrypted to be read by anyone with access to the link.
                            </p>
                            <p><strong>Possible mitigations:</strong></p>
                            <ul class="list-disc pl-5">
                                <li>In order to store them encrypted on the server, and not provide anything other than the link to respondents, the link would need to contain a decryption key.</li>
                                <li>If the server which serves the frontend is different from the server which serves the backend (which it is in this case - cloudflare pages vs fly.io fastapi app),
                                    then we could conceive of a link generated by the frontend which consists of a reference to the backend identifier to fetch the survey with and a decryption key for
                                    the encrypted questions and survey title.</li>
                                <li>If we relaxed the constraint of needing to provide the respondent with just a link, we could ask the survey owner to share the link and decryption key separately.
                                    That way, the user could paste the decryption key in, avoiding the frontend server seeing the key.</li>
                            </ul>
                            <p><strong>Chosen mitigation:</strong> Do nothing. It is likely that the entity which controls the frontend server also controls the backend server. This makes the first mitigation useless and the sacrifice in usability for the second option isn't warranted given that we already assume some level of trust in the server.
                                That said, contributions for optional question/title encryption would be welcomed on the <a href="https://github.com/rested/RSurvA" class="text-primary" target="_blank" rel="noopener noreferrer">GitHub</a>!</p>
                        </li>

                        <li class="mb-4">
                            <p>
                                <strong>Limitation: Tampering with Public Key</strong> - The backend could tamper with the public key sent to users.
                            </p>
                            <p><strong>Possible mitigations:</strong> Using the public key as the URL would allow users to verify it, but would make URLs much longer.</p>
                            <p><strong>Chosen mitigation:</strong> Display the public key on the frontend and ask users to verify it with the survey owner.</p>
                        </li>

                        <li class="mb-4">
                            <p>
                                <strong>Limitation: Public Survey URLs</strong> - The survey URLs are public.
                            </p>
                            <p><strong>Chosen mitigation:</strong> URLs are hard to guess (64 hex chars giving ~256 bits of entropy). The risk of sharing the link should be accepted by the survey owner.</p>
                        </li>
                        <li class="mb-4" id="min-resp-faking">
                            <p>
                                <strong>Limitation: Survey Owner Responding to Their Own Survey</strong> - The survey owner can respond to their own survey, limiting the effectiveness of the minimum responses threshold as the owner could create more responses themselves.
                            </p>
                            <p><strong>Possible mitigations:</strong></p>
                            <ul class="list-disc pl-5">
                                <li>Hide response links from the survey owner, but this would put more trust in the server by requiring it to distribute these links (e.g., via email).</li>
                                <li>Add some form of login and disallow the survey owner from answering, but this could complicate the process.</li>
                                <li>Use frontend state (local storage), which is unreliable and provides false security.</li>
                            </ul>
                            <p><strong>Chosen mitigation:</strong> Inform the respondent and ask them to ensure the survey link was sent in a public channel with at least the mentioned number of respondents during the survey period. A survey owner adding fake responses would not distinguish between real responses in this case.</p>
                        </li>
                        <li class="mb-4">
                            <p>
                                <strong>Limitation: Respondent duplicate responses</strong>- Respondents could 'over-respond' to hide signal in noise.
                            </p>
                            <p><strong>Possible mitigations:</strong> We could end the survey after a given number (x) of responses on the server above the min responses. However, this could have undesired consequences, for example where the audience of possible respondents is larger than x, and the survey owner would still not know that all of the x responses were from one respondent.</p>
                            <p><strong>Chosen mitigation:</strong> Leave this risk largely unmitigated, assuming the effort to create such a response would not be worth it.</p>
                        </li>
                    </ul>
                </article>
            </div>
            <Divider text="Infrastructure" id="infrastructure" />
            <div class="mb-6">
                <p class="text-base-content">
                    The frontend code (where encryption happens) is hosted on <a href="https://pages.cloudflare.com/" target="_blank" rel="noreferrer" class="text-primary hover:underline">Cloudflare Pages</a>.
                </p>
                <p class="text-base-content">
                    The backend is hosted on <a href="https://fly.io/" target="_blank" rel="noreferrer" class="text-primary hover:underline">Fly.io</a>. The encrypted answer data and unencrypted question data are stored on <a href="https://fly.io/docs/reference/redis/" target="_blank" rel="noreferrer" class="text-primary hover:underline">Fly Upstash for Redis</a>.
                </p>
                <p class="text-base-content">
                    You can check the <a href="https://github.com/rested/RSurvA" class="text-primary" target="_blank" rel="noopener noreferrer">code</a> being used and the actions used to deploy it or deploy it to your own infra.
                </p>
                <div class="mermaid">
                    {infrastructureDiagram}
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
