import { randomBytes, scryptSync, timingSafeEqual, createHmac, createHash } from "node:crypto";
import { cookies } from "next/headers";
import type { User, Role } from "@/lib/types";

const SESSION_COOKIE = "ms_session";
const SESSION_TTL = 60 * 60 * 24 * 7; // 7 أيام

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

export function cryptoToken(bytes = 32): string {
  return randomBytes(bytes).toString("hex");
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

function hmacSign(payload: string): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET is not set. Set it in .env — without it sessions cannot be signed securely."
    );
  }
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function signSession(payload: Record<string, unknown>): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${hmacSign(body)}`;
}

function verifySession(token: string): Record<string, unknown> | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = hmacSign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (typeof payload.exp === "number" && payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function createSessionToken(user: Pick<User, "id" | "role">): string {
  return signSession({
    uid: user.id,
    role: user.role,
    exp: Date.now() + SESSION_TTL * 1000,
  });
}

export async function getSession(): Promise<{
  userId: string;
  role: Role;
} | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = verifySession(token);
  if (!payload || typeof payload.uid !== "string") return null;
  return { userId: payload.uid, role: (payload.role as Role) || "customer" };
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL,
  };
}

export function verifyToken(token: string): { userId: string; role: Role } | null {
  const payload = verifySession(token);
  if (!payload || typeof payload.uid !== "string") return null;
  return { userId: payload.uid, role: (payload.role as Role) || "customer" };
}

export function getAdminCredentials() {
  return {
    email: (process.env.ADMIN_EMAIL || "admin@medostore.shop").toLowerCase(),
    passwordHash: process.env.ADMIN_PASSWORD_HASH || "",
  };
}