import { NextResponse } from "next/server";
import {
  createSessionToken,
  getAdminCredentials,
  getSession,
  hashPassword,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/auth";
import { getStore } from "@/lib/db/store";
import { uid } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json({ message: "أدخل البريد وكلمة المرور" }, { status: 422 });
    }

    // دخول الأدمن
    const admin = getAdminCredentials();
    if (email === admin.email && admin.passwordHash && verifyPassword(password, admin.passwordHash)) {
      const token = createSessionToken({ id: "admin", role: "admin" });
      const res = NextResponse.json({ user: { name: "مدير المتجر", email, role: "admin" } });
      res.cookies.set("ms_session", token, sessionCookieOptions());
      return res;
    }

    const store = await getStore();
    const user = store.users.find((u) => u.email === email && u.role === "customer");
    if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ message: "بيانات الدخول غير صحيحة" }, { status: 401 });
    }

    user.lastLoginAt = new Date().toISOString();
    const token = createSessionToken({ id: user.id, role: user.role });
    const res = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    res.cookies.set("ms_session", token, sessionCookieOptions());
    return res;
  } catch {
    return NextResponse.json({ message: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}