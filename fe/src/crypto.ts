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