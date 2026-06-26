import bcrypt from 'bcryptjs';

/**
 * Hashes a plain text password using bcrypt.
 * @param password Plain text password
 * @returns The cryptographically hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
};

/**
 * Compares a plain text password with a stored hash.
 * @param password Plain text password
 * @param hash Stored password hash
 * @returns True if they match, false otherwise
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
