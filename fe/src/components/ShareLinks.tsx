import { h } from 'preact';

interface ShareLinksProps {
    link: string;
    privateKey: string;
    duration: string;
    minResponses: number;
    publicKey: string;
}

const ShareLinks = ({ link, privateKey, duration, minResponses, publicKey }: ShareLinksProps) => {
    const handleCopyPrivateKeyToClipboard = () => {
        navigator.clipboard.writeText(privateKey).then(() => {
            alert("Private key copied to clipboard!");
        });
    };
    const handleCopyPublicKeyToClipboard = () => {
        navigator.clipboard.writeText(publicKey).then(() => {
            alert("Private key copied to clipboard!");
        });
    };


    return (
        <div>
            <p>Your survey has been stored! Here is your private key:</p>
            <input value={privateKey} disabled={true}/> <button onClick={handleCopyPrivateKeyToClipboard}>Copy to clipboard</button>
            <p>Keep this safe as you will need it to view the result after {duration} and at least {minResponses} responses are collected</p>
            <p>
                Share this link with those you want to complete the survey <a href={link}>{link}</a>
            </p>
            <p>
                The link contains the sha256 hash of your full RSA public key which is:
            </p>
            <input value={publicKey} disabled={true}/> <button onClick={handleCopyPublicKeyToClipboard}>Copy to clipboard</button>

            <button onClick={()=> {
                window.location.href = window.location.href
            }}>Create a new survey</button>
        </div>
    );
};

export default ShareLinks;