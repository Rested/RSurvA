import forge from 'node-forge';


interface EncryptedComponents {
    iv: string;
    encryptedMessage: string;
    tag: string;
    encryptedKey: string;
}

// Helper function to serialize EncryptedComponents
function serializeComponents(components: EncryptedComponents): string {
    return JSON.stringify(components);
}

// Helper function to deserialize EncryptedComponents
function deserializeComponents(serialized: string): EncryptedComponents {
    return JSON.parse(serialized);
}




export function encryptStringWithPublicKey(publicKeyPem: string, message: string): string {
    // Generate a random AES key
    const aesKey = forge.random.getBytesSync(32); // 256-bit key
    const iv = forge.random.getBytesSync(12); // 12-byte IV (for AES-GCM)

    // Encrypt the message using the AES key
    const cipher = forge.cipher.createCipher('AES-GCM', aesKey);
    cipher.start({ iv });
    cipher.update(forge.util.createBuffer(message));
    cipher.finish();
    const encryptedMessage = cipher.output.getBytes();
    const tag = cipher.mode.tag.getBytes();

    // Encrypt the AES key using the RSA public key
    const publicKey = forge.pki.publicKeyFromPem(forge.util.decode64(publicKeyPem));
    const encryptedKey = publicKey.encrypt(aesKey);

    // Encode all components in base64
    const components: EncryptedComponents = {
        iv: forge.util.encode64(iv),
        encryptedMessage: forge.util.encode64(encryptedMessage),
        tag: forge.util.encode64(tag),
        encryptedKey: forge.util.encode64(encryptedKey)
    };

    return serializeComponents(components);
}

export async function decryptStringWithPrivateKey(privateKeyPem: string, serializedComponents: string): Promise<string> {
    const { iv, encryptedMessage, encryptedKey, tag } = deserializeComponents(serializedComponents);

    // Decode components from base64
    const decodedIv = forge.util.decode64(iv);
    const decodedEncryptedMessage = forge.util.decode64(encryptedMessage);
    const decodedEncryptedKey = forge.util.decode64(encryptedKey);
    const decodedTag = forge.util.decode64(tag);

    // Decrypt the AES key using the RSA private key
    const privateKey = forge.pki.privateKeyFromPem(forge.util.decode64(privateKeyPem));
    const aesKey = privateKey.decrypt(decodedEncryptedKey);

    // Decrypt the message using the AES key
    const decipher = forge.cipher.createDecipher('AES-GCM', aesKey);
    decipher.start({
        iv: decodedIv,
        tag: forge.util.createBuffer(decodedTag)
    });
    decipher.update(forge.util.createBuffer(decodedEncryptedMessage));
    const success = decipher.finish();

    if (success) {
        return decipher.output.getBytes();
    } 
        throw new Error('Decryption failed');
    
}


async function computeSHA256HexOfBase64(base64String) {
    const binaryString = forge.util.decode64(base64String);
    const md = forge.md.sha256.create();
    md.update(binaryString);
    return md.digest().toHex();
}

export async function generateRSA() {
    // Generate a new RSA key pair
    const keypair = forge.pki.rsa.generateKeyPair(2048);

    // Convert public and private keys to PEM format
    const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
    const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);

    // Convert PEM to base64 using btoa (browser built-in)
    const publicKeyB64 = btoa(publicKeyPem);
    const privateKeyB64 = btoa(privateKeyPem);

    // Compute the SHA-256 hash of the base64 encoded public key
    const surveyId = await computeSHA256HexOfBase64(publicKeyB64);

    return {
        surveyId,
        publicKeyB64,
        privateKeyB64
    };
}

