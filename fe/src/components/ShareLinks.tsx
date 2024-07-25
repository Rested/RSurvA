import { h } from 'preact';
import { useState } from 'preact/hooks';

// SVG for clipboard copy icon
const ClipboardCopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M8 2a2 2 0 00-2 2H5a3 3 0 00-3 3v7a3 3 0 003 3h8a3 3 0 003-3V7a3 3 0 00-3-3h-1a2 2 0 00-2-2H8zm0 1h4a1 1 0 011 1v1H7V4a1 1 0 011-1zM5 7h10v7a2 2 0 01-2 2H7a2 2 0 01-2-2V7z" />
    </svg>
);

interface ShareLinksProps {
    link: string;
    privateKey: string;
    duration: string;
    minResponses: number;
    publicKey: string;
}

const ShareLinks = ({ link, privateKey, duration, minResponses, publicKey }: ShareLinksProps) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const handleCopyToClipboard = (text: string, message: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setModalMessage(message);
            setModalVisible(true);
        });
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    return (
        <div class="p-6 mt-8 max-w-4xl mx-auto bg-white shadow-md rounded-lg relative">
            <p class="text-lg font-medium text-gray-900 mb-4">Your survey has been stored! Here is your <b>private key</b>:</p>
            <div class="mb-4 flex items-center">
                <input
                    value={privateKey}
                    disabled={true}
                    class="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-100 text-gray-900"
                />
                <button
                    onClick={() => handleCopyToClipboard(privateKey, "Private key copied to clipboard!")}
                    class="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-r-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
                >
                    <ClipboardCopyIcon class="mr-2" /> Copy
                </button>
            </div>
            <p class="text-gray-900 mb-4"><b>Keep this safe as you will need it to view the responses</b> after <b>{duration}</b> and at least <b>{minResponses} responses</b> are collected.</p>
            <p class="text-gray-900 mb-4">Share this link with those you want to complete the survey:</p>
            <div class="mb-4 flex items-center">
                <input
                    value={link}
                    disabled={true}
                    class="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-100 text-blue-600"
                />
                <button
                    onClick={() => handleCopyToClipboard(link, "Survey link copied to clipboard!")}
                    class="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-r-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
                >
                    <ClipboardCopyIcon class="mr-2" /> Copy
                </button>
            </div>
            <p class="text-gray-900 mb-4">The link contains the SHA-256 hash of <b>your full RSA public key</b> which is:</p>
            <div class="mb-4 flex items-center">
                <input
                    value={publicKey}
                    disabled={true}
                    class="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-100 text-gray-900"
                />
                <button
                    onClick={() => handleCopyToClipboard(publicKey, "Public key copied to clipboard!")}
                    class="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-r-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
                >
                    <ClipboardCopyIcon class="mr-2" /> Copy
                </button>
            </div>
            <button
                onClick={() => window.location.href = window.location.href}
                class="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
                Create a new survey
            </button>

            {modalVisible && (
                <div class="fixed inset-0 flex items-center justify-center z-50">
                    <div class="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
                    <div class="bg-white rounded-lg p-6 z-10">
                        <p class="text-gray-900 mb-4">{modalMessage}</p>
                        <button
                            onClick={closeModal}
                            class="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShareLinks;
