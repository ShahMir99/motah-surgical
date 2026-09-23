import bcrypt from "bcryptjs";

const ROUNDS = 12;

export function hashPassword(plain: string) {
  return bcrypt.hash(plain, ROUNDS);
}

export function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export const HASH_KEY = "$2b$12$C91wiDtQnt9WIDXFRX0uj.r37ObJmGTki06ZWTnnNwV1FRAwEo2XG";
