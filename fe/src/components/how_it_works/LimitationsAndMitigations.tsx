import { adversarialStylometryPrompt } from '../../prompts';
import Collapse from './Collapse';

const examplePromptQ = "Are birds real?";
const examplePromptA = "Nah birds ain't real";

const LimitationsAndMitigations = () => (
    <>
        <Collapse title="Limitations and Mitigations" emoji="🤨😇">
            <Collapse title="Identifying Respondent Through Answers Across Questions" emoji="🕵️‍♂️❔">
                <article className="prose lg:prose-xl text-base-content space-y-4">
                    <p><strong>Limitation:</strong> The survey owner may attempt to look at answers across questions to uncover the respondent's identity.</p>
                    <p><strong>Possible mitigation:</strong> Do nothing if each question's answers are sufficiently anonymous.</p>
                    <p><strong>Chosen mitigation:</strong> Shuffle the encrypted answers (on a per-question basis) on the server before sending them to the survey answerer.</p>
                    <div className="pl-5">
                        <p>So real answers:</p>
                        <ol className="list-decimal ml-5">
                            <li>
                                What is your favourite colour?
                                <ul className="list-disc pl-5">
                                    <li>green</li>
                                    <li>blue</li>
                                </ul>
                            </li>
                            <li>
                                What letter does your favourite colour begin with?
                                <ul className="list-disc pl-5">
                                    <li>g</li>
                                    <li>b</li>
                                </ul>
                            </li>
                        </ol>
                        <p>Becomes (in one permutation):</p>
                        <ol className="list-decimal ml-5">
                            <li>
                                What is your favourite colour?
                                <ul className="list-disc pl-5">
                                    <li>blue</li>
                                    <li>green</li>
                                </ul>
                            </li>
                            <li>
                                What letter does your favourite colour begin with?
                                <ul className="list-disc pl-5">
                                    <li>g</li>
                                    <li>b</li>
                                </ul>
                            </li>
                        </ol>
                    </div>
                </article>
            </Collapse>

            <Collapse title="Stylometric Analysis" emoji="✍️🔍" contentBgColor="bg-base-200">
                <article class="prose lg:prose-xl text-base-content space-y-4">
                    <p><strong>Limitation:</strong> The survey owner may attempt <a href="https://en.wikipedia.org/wiki/Stylometry" class="text-primary">stylometric</a> analysis to determine who said what. References to particular people or events may reveal the respondent's identity.</p>
                    <p><strong>Possible mitigations:</strong></p>
                    <ul class="list-disc pl-5">
                        <li>LLMs can transform text to be sound, safe, and sensible (criteria described <a href="https://en.wikipedia.org/wiki/Adversarial_stylometry" class="text-primary">here</a>), but running these in the browser is currently problematic due to limited WebGPU support.</li>
                        <li>Using third-party networks like huggingface for model serving introduces hosting costs and dependencies.</li>
                    </ul>
                    <p><strong>Chosen mitigation:</strong> Allow the user to click on a button which provides a prompt they can use with an LLM they trust to transform their answer. If some BYOLLM (bring your own LLM) apis become available, this should shift to use them.</p>
                    <p>The prompt for the question "{examplePromptQ}" and answer "{examplePromptA}" is as follows:
                        <code class="block p-2 mt-2 rounded whitespace-pre-line">{adversarialStylometryPrompt({ question: examplePromptQ, answer: examplePromptA })}</code>
                        This gives <i>No, birds do not exist.</i> in gpt-4
                    </p>
                </article>
            </Collapse>

            <Collapse title="Survey Owner Controlling Backend" emoji="👨‍💻🐱‍💻" contentBgColor="bg-base-200">
                <article class="prose lg:prose-xl text-base-content space-y-4">
                    <p><strong>Limitation:</strong> If the survey owner controls the backend, they could retrieve the answers at any point after survey creation using both the private key (as the survey owner) and the encrypted answers (as the server/backend controller).</p>
                    <p><strong>Possible mitigations:</strong> Timelock encryption would be a fairly nice way to remove this trust on the server owner, but it is a fairly hard problem (<a href="https://gwern.net/self-decrypting" class="text-primary">gwern has a good write up</a>). The most viable implementation would be <a href="https://github.com/drand/tlock-js" class="text-primary">tlock-js</a>, which would avoid this server owner trust at the expense of introducing a 3rd party network dependency.</p>
                    <p><strong>Chosen mitigation:</strong> While tlock-js could be viable, it introduces a networked 3rd party dependency that needs to be accessible and not compromised when the respondent encrypts or the survey owner attempts to decrypt. Early decryption has the same risks as the <a href="#min-resp-faking" class="underline">minimum response threshold faking</a> and benefits from the same mitigations. The difference is it has a slightly stronger condition in that there is a timing element. <span id="timing-attacks">For example, if the survey is posted to a public channel and it's known that the public channel will only be viewed from 10 am by Alice and from 12 pm by Bob, then an answer decrypted at 11 am is likely from Alice.</span> This can also bypass mitigations around question correlation.
                        For this reason we strengthen the advise to the user to checking that at least the minimum responses number of users are likely to have seen the message at that time.</p>
                    <p>That said, contributions for optional usage of tlock-js would be welcomed on the <a href="https://github.com/rested/RSurvA" class="text-primary" target="_blank" rel="noopener noreferrer">GitHub</a>!</p>
                </article>
            </Collapse>

            <Collapse title="Questions Stored Unencrypted" emoji="📂🔓" contentBgColor="bg-base-200">
                <article class="prose lg:prose-xl text-base-content space-y-4">
                    <p><strong>Limitation:</strong> The backend stores the questions unencrypted to be read by anyone with access to the link.</p>
                    <p><strong>Possible mitigations:</strong></p>
                    <ul class="list-disc pl-5">
                        <li>In order to store them encrypted on the server, and not provide anything other than the link to respondents, the link would need to contain a decryption key.</li>
                        <li>If the server which serves the frontend is different from the server which serves the backend (which it is in this case - cloudflare pages vs fly.io fastapi app), then we could conceive of a link generated by the frontend which consists of a reference to the backend identifier to fetch the survey with and a decryption key for the encrypted questions and survey title.</li>
                        <li>If we relaxed the constraint of needing to provide the respondent with just a link, we could ask the survey owner to share the link and decryption key separately. That way, the user could paste the decryption key in, avoiding the frontend server seeing the key.</li>
                    </ul>
                    <p><strong>Chosen mitigation:</strong> Do nothing. It is likely that the entity which controls the frontend server also controls the backend server. This makes the first mitigation useless and the sacrifice in usability for the second option isn't warranted given that we already assume some level of trust in the server. That said, contributions for optional question/title encryption would be welcomed on the <a href="https://github.com/rested/RSurvA" class="text-primary" target="_blank" rel="noopener noreferrer">GitHub</a>!</p>
                </article>
            </Collapse>

            <Collapse title="Tampering with Public Key" emoji="🔒🛠️" contentBgColor="bg-base-200">
                <article class="prose lg:prose-xl text-base-content space-y-4">
                    <p><strong>Limitation:</strong> The backend could tamper with the public key sent to users.</p>
                    <p><strong>Possible mitigations:</strong> Using the public key as the URL would allow users to verify it, but would make URLs much longer.</p>
                    <p><strong>Chosen mitigation:</strong> Display the public key on the frontend and ask users to verify it with the survey owner.</p>
                </article>
            </Collapse>

            <Collapse title="Public Survey URLs" emoji="🔗🌐" contentBgColor="bg-base-200">
                <article class="prose lg:prose-xl text-base-content">
                    <p><strong>Limitation:</strong> The survey URLs are public.</p>
                    <p><strong>Chosen mitigation:</strong> URLs are hard to guess (64 hex chars giving ~256 bits of entropy). The risk of sharing the link should be accepted by the survey owner.</p>
                </article>
            </Collapse>

            <Collapse title="Survey Owner Responding to Their Own Survey" emoji="👨‍💻📝" contentBgColor="bg-base-200">
                <article class="prose lg:prose-xl text-base-content space-y-4">
                    <p><strong>Limitation:</strong> The survey owner can respond to their own survey, limiting the effectiveness of the minimum responses threshold as the owner could create
                        more responses themselves.</p>
                    <p><strong>Possible mitigations:</strong></p>
                    <ul class="list-disc pl-5">
                        <li>Hide response links from the survey owner, but this would put more trust in the server by requiring it to distribute these links (e.g., via email).</li>
                        <li>Add some form of login and disallow the survey owner from answering, but this could complicate the process.</li>
                        <li>Use frontend state (local storage), which is unreliable and provides false security.</li>
                    </ul>
                    <p><strong>Chosen mitigation:</strong> Inform the respondent and ask them to ensure the survey link was sent in a public channel with at least the mentioned number of respondents during the survey period. A survey owner adding fake responses would not distinguish between real responses in this case.</p>
                </article>
            </Collapse>

            <Collapse title="Respondent Duplicate Responses" emoji="👥🔢" contentBgColor="bg-base-200"  >
                <article class="prose lg:prose-xl text-base-content space-y-4">
                    <p><strong>Limitation:</strong> Respondents could 'over-respond' to hide signal in noise.</p>
                    <p><strong>Possible mitigations:</strong> We could end the survey after a given number (x) of responses on the server above the min responses. However, this could have undesired consequences, for example where the audience of possible respondents is larger than x, and the survey owner would still not know that all of the x responses were from one respondent.</p>
                    <p><strong>Chosen mitigation:</strong> Leave this risk largely unmitigated, assuming the effort to create such a response would not be worth it.</p>
                </article>
            </Collapse>
        </Collapse>
    </>
);

export default LimitationsAndMitigations;