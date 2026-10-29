import crypto from 'crypto';
import { config } from '../config/env.js';

// Derive 32-byte key from ENCRYPTION_SECRET_KEY
const ALGORITHM = 'aes-256-gcm';
const SECRET_KEY = crypto.createHash('sha256').update(config.encryptionSecretKey || 'chat_replyzer_default_secret_32b!').digest();

/**
 * Encrypt plaintext using AES-256-GCM
 * @param {string} text - Plaintext to encrypt
 * @returns {string} - Combined encrypted string: iv:authTag:encryptedData (hex encoded)
 */
export const encryptToken = (text) => {
  if (!text) return '';
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
};

/**
 * Decrypt token using AES-256-GCM
 * @param {string} encryptedString - iv:authTag:encryptedData (hex encoded)
 * @returns {string} - Decrypted plaintext
 */
export const decryptToken = (encryptedString) => {
  if (!encryptedString || !encryptedString.includes(':')) return '';
  try {
    const parts = encryptedString.split(':');
    if (parts.length !== 3) return '';
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encryptedText = parts[2];

    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error.message);
    return '';
  }
};
