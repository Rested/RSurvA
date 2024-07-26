export async function encryptStringWithPublicKey(publicKeyB64, stringToEncrypt) {
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

export async function decryptStringWithPrivateKey(privateKeyB64, stringToDecrypt) {
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


export async function generateRSA(){
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
    return {
        surveyId,
        publicKeyB64,
        privateKeyB64
    }

}