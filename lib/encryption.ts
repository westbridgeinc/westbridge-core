import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
// NIST SP 800-38D recommends a 96-bit (12-byte) IV for AES-GCM. Using the
// recommended length avoids the extra GHASH derivation step that GCM applies
// to non-96-bit IVs, which is slightly slower and less well-analysed.
const IV_BYTES = 12;

function getKey(): Buffer {
  const secret = process.env.ENCRYPTION_KEY;
  if (!secret || secret.length < 64) throw new Error("ENCRYPTION_KEY must be a 64 valid hex characters (32 bytes)");
  const key = Buffer.from(secret, "hex");
  if (key.length !== 32) throw new Error("ENCRYPTION_KEY must decode to exactly 32 bytes — ensure it contains only valid hex characters");
  return key;
}

function getKeyFromHex(secret: string): Buffer {
  if (!secret || secret.length < 64) throw new Error("Encryption key must be 64 valid hex characters (32 bytes)");
  const key = Buffer.from(secret, "hex");
  if (key.length !== 32) throw new Error("Encryption key must decode to exactly 32 bytes — ensure it contains only valid hex characters");
  return key;
}

export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv.toString("hex"), authTag.toString("hex"), encrypted.toString("hex")].join(":");
}

export function decrypt(ciphertext: string): string {
  const parts = ciphertext.split(":");
  if (parts.length !== 3) throw new Error("Invalid ciphertext format: expected ivHex:authTagHex:encryptedHex");
  const [ivHex, authTagHex, encryptedHex] = parts;
  if (!ivHex || !authTagHex || !encryptedHex) throw new Error("Invalid ciphertext format: one or more segments are empty");
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");

  const tryDecrypt = (key: Buffer): string => {
    // Enforce the expected 128-bit (16-byte) GCM authentication tag length
    // before decryption to prevent tag-truncation forgery attacks.
    // An attacker who controls the ciphertext could otherwise supply a
    // shorter auth tag that passes verification by chance.
    if (authTag.length !== 16) {
      throw new Error("Invalid authentication tag length — expected 16 bytes");
    }
    const decipher = createDecipheriv(ALGORITHM, key, iv); // nosemgrep: javascript.node-crypto.security.gcm-no-tag-length.gcm-no-tag-length
    decipher.setAuthTag(authTag);
    return decipher.update(encrypted, undefined, "utf8") + decipher.final("utf8");
  };

  try {
    return tryDecrypt(getKey());
  } catch (primaryErr) {
    const prevSecret = process.env.ENCRYPTION_KEY_PREVIOUS;
    if (prevSecret) {
      try {
        return tryDecrypt(getKeyFromHex(prevSecret));
      } catch {
        // Both keys failed — fall through to throw.
      }
    }
    // Distinguish integrity failure from wrong-key for observability.
    // Do not expose which key was tried to callers.
    const isAuthFailure =
      primaryErr instanceof Error &&
      (primaryErr.message.includes("Unsupported state") ||
        primaryErr.message.includes("bad decrypt") ||
        primaryErr.message.includes("authentication"));
    throw new Error(isAuthFailure ? "Decryption failed: authentication tag mismatch" : "Decryption failed");
  }
}
