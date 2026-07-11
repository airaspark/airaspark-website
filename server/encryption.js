import crypto from 'crypto';

// The encryption key must be exactly 32 bytes (256 bits) long.
// We pull this from your .env file.
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'); 
const ALGORITHM = 'aes-256-gcm';

// Precompute the buffer so we don't recreate it on every encryption/decryption request.
const KEY_BUFFER = Buffer.from(ENCRYPTION_KEY, 'hex');

export function encrypt(text) {
    // Generate a random 12-byte Initialization Vector (IV) for every encryption
    const iv = crypto.randomBytes(12);
    
    // Create the cipher
    const cipher = crypto.createCipheriv(ALGORITHM, KEY_BUFFER, iv);
    
    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Get the auth tag (this ensures the data wasn't tampered with)
    const authTag = cipher.getAuthTag().toString('hex');
    
    // Return all three parts needed to decrypt later
    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted,
        authTag: authTag
    };
}

export function decrypt(encryptedObject) {
    const decipher = crypto.createDecipheriv(
        ALGORITHM, 
        KEY_BUFFER, 
        Buffer.from(encryptedObject.iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(encryptedObject.authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedObject.encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
}