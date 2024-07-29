import { useState } from 'preact/hooks';
import { adversarialStylometryPrompt } from '../prompts';
import { ClipboardIcon, ShieldCheckIcon } from '@heroicons/react/24/solid'

export const Anonymize = ({ question, answer }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const handleToggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleCopyToClipboard = (text, message) => {
        navigator.clipboard.writeText(text).then(() => {
            setToastMessage(message);
            setToastVisible(true);
            setTimeout(() => setToastVisible(false), 3000);
        });
    };

    const prompt = adversarialStylometryPrompt({ question, answer });

    return (
        <div>
            <button
                className="btn btn-accent mt-2 btn-sm"
                onClick={handleToggleModal}
                disabled={!answer}
            >
                <ShieldCheckIcon className="w-5 mr-1" /> Anonymize
            </button>

            
            <div className={`modal modal-${isModalOpen ? 'open' : 'close'}`}>
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleToggleModal}>✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Prompt</h3>
                    <div class="mb-4 flex items-center mt-2">
                        <input
                            value={prompt}
                            readOnly
                            class="flex-grow px-4 py-2 input input-bordered mr-2"
                        />
                        <button
                            onClick={() => handleCopyToClipboard(prompt, "Prompt copied to clipboard!")}
                            class="px-4 py-2 btn btn-primary rounded-r-lg flex items-center mr-2"
                        >
                            <ClipboardIcon class="w-5" /> Copy
                        </button>
                    </div>
                    <h3 className="font-bold text-lg mt-4">How to Apply</h3>
                    <p>Open up an LLM you trust for example <a class="link" target="_blank" href="https://chatgpt.com" rel="noreferrer">chatgpt</a> and enter the prompt. Then copy the answer, close this modal and paste it in the answer box.</p>
                </div>
            </div>

            {toastVisible && (
                <div class="toast toast-top toast-end">
                    <div class="alert alert-success">
                        <div>
                            <span>{toastMessage}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}