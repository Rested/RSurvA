import { KeyIcon, LockClosedIcon, ShieldCheckIcon, CodeBracketIcon } from '@heroicons/react/24/solid';
import Collapse from './Collapse';

const KeyBenefits = () => (
    <>
        <Collapse title="Key Benefits" emoji="🔑">
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
        </Collapse>
    </>
);

export default KeyBenefits;
