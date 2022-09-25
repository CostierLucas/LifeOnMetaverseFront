import { hash, compare } from "bcryptjs";
import { crypto } from "crypto";

export async function hashToken(token) {
  const hashedToken = await hash(token, 12);
  return hashedToken;
}
