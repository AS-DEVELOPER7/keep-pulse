import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const SECRET_KEY = process.env.ENCRYPTION_KEY || process.env.ENCRYPTION_SECRET || 'keep-pulse-super-secret-key-32b!';

// Ensure key is exactly 32 bytes
const getKey = () => {
  return crypto.createHash('sha256').update(SECRET_KEY).digest();
};

export const encryptData = (data) => {
  if (!data) return '';
  try {
    const text = typeof data === 'object' ? JSON.stringify(data) : String(data);
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    
    return JSON.stringify({
      iv: iv.toString('hex'),
      encryptedData: encrypted,
      authTag: authTag,
    });
  } catch (error) {
    console.error('Encryption failed:', error);
    return '';
  }
};

export const decryptData = (encryptedJson) => {
  if (!encryptedJson) return null;
  if (typeof encryptedJson !== 'string' && typeof encryptedJson !== 'object') return encryptedJson;

  let parsedPayload = encryptedJson;
  if (typeof encryptedJson === 'string') {
    // If it doesn't look like JSON payload starting with '{', treat as unencrypted legacy string
    if (!encryptedJson.trim().startsWith('{')) {
      return encryptedJson;
    }
    try {
      parsedPayload = JSON.parse(encryptedJson);
    } catch {
      return encryptedJson;
    }
  }

  // Check if it has required encryption properties
  if (!parsedPayload || !parsedPayload.iv || !parsedPayload.encryptedData || !parsedPayload.authTag) {
    return typeof encryptedJson === 'string' ? encryptedJson : JSON.stringify(encryptedJson);
  }

  try {
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      getKey(),
      Buffer.from(parsedPayload.iv, 'hex')
    );
    decipher.setAuthTag(Buffer.from(parsedPayload.authTag, 'hex'));
    
    let decrypted = decipher.update(parsedPayload.encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    try {
      return JSON.parse(decrypted);
    } catch {
      return decrypted;
    }
  } catch (error) {
    return typeof encryptedJson === 'string' ? encryptedJson : JSON.stringify(encryptedJson);
  }
};
