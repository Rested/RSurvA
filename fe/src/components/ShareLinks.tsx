import { h } from 'preact';
import { useState } from 'preact/hooks';
import TitleBar from './TitleBar';
import { Divider } from './Divider';

const ClipboardCopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M8 2a2 2 0 00-2 2H5a3 3 0 00-3 3v7a3 3 0 003 3h8a3 3 0 003-3V7a3 3 0 00-3-3h-1a2 2 0 00-2-2H8zm0 1h4a1 1 0 011 1v1H7V4a1 1 0 011-1zM5 7h10v7a2 2 0 01-2 2H7a2 2 0 01-2-2V7z" />
    </svg>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-5 w-5">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3" />
    </svg>
);

interface ShareLinksProps {
    link: string;
    privateKey: string;
    duration: string;
    minResponses: number;
    publicKey: string;
    surveyName: string;
}

const ShareLinks = ({ surveyName, link, privateKey, duration, minResponses, publicKey }: ShareLinksProps) => {
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const handleCopyToClipboard = (text: string, message: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setToastMessage(message);
            setToastVisible(true);
            setTimeout(() => setToastVisible(false), 3000);
        });
    };
    const handleDownload = (filename: string, text: string) => {
        try {
            let element = document.createElement('a');
            element.setAttribute('href', `data:text/plain;charset=utf-8,${  encodeURIComponent(text)}`);
            element.setAttribute('download', filename);
          
            element.style.display = 'none';
            document.body.appendChild(element);
          
            element.click();
          
            document.body.removeChild(element);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    return (
        <div class="p-6 mt-8 max-w-4xl mx-auto bg-base-200 shadow-lg rounded-lg relative">
            <TitleBar text="Share Survey" />
            <p class="text-lg font-medium text-base-content mb-4">Your survey '{surveyName}' has been stored! Here is your <b>private key</b>:</p>
            <div class="mb-4 flex items-center">
                <input
                    value={privateKey}
                    readOnly
                    class="flex-grow px-4 py-2 input input-bordered mr-2"
                />
                <button
                    onClick={() => handleCopyToClipboard(privateKey, "Private key copied to clipboard!")}
                    class="px-4 py-2 btn btn-primary rounded-r-lg flex items-center mr-2"
                >
                    <ClipboardCopyIcon /> Copy
                </button>
                <button
                    onClick={() => handleDownload(`${surveyName}-private-key.txt`, privateKey)}
                    class="px-4 py-2 btn btn-secondary rounded-lg flex items-center"
                >
                    <DownloadIcon /> Download
                </button>
            </div>
            <p class="text-base-content mb-4"><b>Keep this safe as you will need it to view the responses</b> after <b>{duration}</b> and at least <b>{minResponses} responses</b> are collected.</p>
            <Divider text="Share Link" />
            <p class="text-base-content mb-4">Share this link with those you want to complete the survey:</p>
            <div class="mb-4 flex items-center">
                <input
                    value={link}
                    readOnly
                    class="flex-grow px-4 py-2 input input-bordered mr-2"
                />
                <button
                    onClick={() => handleCopyToClipboard(link, "Survey link copied to clipboard!")}
                    class="px-4 py-2 btn btn-primary rounded-r-lg flex items-center mr-2"
                >
                    <ClipboardCopyIcon /> Copy
                </button>
                <button
                    onClick={() => handleDownload(`${surveyName}-survey-link.txt`, privateKey)}
                    class="px-4 py-2 btn btn-secondary rounded-lg flex items-center"
                >
                    <DownloadIcon /> Download
                </button>
            </div>
            <p class="text-base-content mb-4">The link contains the SHA-256 hash of <b>your full RSA public key</b> which is:</p>
            <div class="mb-4 flex items-center">
                <input
                    value={publicKey}
                    readOnly
                    class="flex-grow px-4 py-2 input input-bordered mr-2"
                />
                <button
                    onClick={() => handleCopyToClipboard(publicKey, "Public key copied to clipboard!")}
                    class="px-4 py-2 btn btn-primary rounded-r-lg flex items-center mr-2"
                >
                    <ClipboardCopyIcon class="mr-2" /> Copy
                </button>
                <button
                    onClick={() => handleDownload(`${surveyName}-public-key.txt`, privateKey)}
                    class="px-4 py-2 btn btn-secondary rounded-lg flex items-center"
                >
                    <DownloadIcon class="mr-2" /> Download
                </button>
            </div>
            <button
                onClick={() => {
                    window.location.reload();
                }}
                class="w-full px-4 py-2 btn btn-success text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transform hover:scale-105 transition-transform duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-offset-2"
            >
                Create a new survey
            </button>

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
};

export default ShareLinks;