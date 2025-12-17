import bcrypt from 'bcryptjs';
import { APP_CONFIG } from '@student-api/shared-constants';

// Type definition for the crypto interface
interface CryptoInterface {
  randomBytes(size: number): Uint8Array;
}

// Platform-agnostic crypto implementation
const getCrypto = async (): Promise<CryptoInterface> => {
  // In browser or Deno with Web Crypto API
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    return {
      randomBytes: (size: number): Uint8Array => {
        const buffer = new Uint8Array(size);
        crypto.getRandomValues(buffer);
        return buffer;
      }
    };
  }

  // In Node.js
  try {
    const nodeCrypto = await import('node:crypto');
    return {
      randomBytes: (size: number): Buffer => {
        return nodeCrypto.randomBytes(size);
      }
    };
  } catch (_e) {
    throw new Error('No secure random number generator available');
  }
};

export class CryptoUtil {
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, APP_CONFIG.BCRYPT_ROUNDS);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Generates a cryptographically secure random string
   * @param length - Length of the random string to generate (default: 32)
   * @returns A URL-safe base64 encoded random string
   */
  static async generateRandomString(length: number = 32): Promise<string> {
    const crypto = await getCrypto();
    const bytes = crypto.randomBytes(Math.ceil(length * 3 / 4));
    
    // Convert bytes to base64 string in a cross-platform way
    let base64: string;
    if (typeof Buffer !== 'undefined') {
      // Node.js environment
      base64 = Buffer.from(bytes).toString('base64');
    } else if (typeof btoa === 'function') {
      // Browser environment
      const binary = String.fromCharCode(...Array.from(bytes));
      base64 = btoa(binary);
    } else {
      // Fallback for environments without Buffer or btoa
      throw new Error('No base64 encoding function available');
    }
    
    return base64
      .replace(/[+\/]/g, '')
      .slice(0, length);
  }

  /**
   * Generates a cryptographically secure random string that is URL-safe
   * @param length - Length of the random string to generate (default: 32)
   * @returns A URL-safe base64url encoded random string
   */
  static async generateSecureToken(length: number = 32): Promise<string> {
    const crypto = await getCrypto();
    const bytes = crypto.randomBytes(length);
    
    // Convert bytes to base64 string in a cross-platform way
    let base64: string;
    if (typeof Buffer !== 'undefined') {
      // Node.js environment
      base64 = Buffer.from(bytes).toString('base64');
    } else if (typeof btoa === 'function') {
      // Browser environment
      const binary = String.fromCharCode(...Array.from(bytes));
      base64 = btoa(binary);
    } else {
      // Fallback for environments without Buffer or btoa
      throw new Error('No base64 encoding function available');
    }
    
    return base64
      .replace(/[+\/]/g, '')
      .slice(0, length);
  }
}
