import { hash, verify } from '@node-rs/bcrypt';

export async function hashPassword(password: string): Promise<string> {
  const hashedPassword = await hash(password);
  return hashedPassword;
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const isMatch = await verify(password, hashedPassword);
  return isMatch;
}
