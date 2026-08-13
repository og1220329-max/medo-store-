import { NextResponse } from "next/server";
import { getStore, saveStore } from "@/lib/db/store";
import { hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const token = String(body.token || "").trim();
  const password = String(body.password || "");

  if (!token) {
    return NextResponse.json({ message: "الرابط غير صالح" }, { status: 422 });
  }
  if (password.length < 8) {
    return NextResponse.json({ message: "كلمة المرور 8 أحرف على الأقل" }, { status: 422 });
  }

  const store = await getStore();
  const user = store.users.find((u) => u.resetTokenHash === token);
  if (!user) {
    return NextResponse.json({ message: "الرابط غير صالح أو منتهي" }, { status: 404 });
  }
  if (!user.resetExpiresAt || new Date(user.resetExpiresAt).getTime() < Date.now()) {
    return NextResponse.json({ message: "انتهت صلاحية الرابط، اطلب رابطًا جديدًا" }, { status: 410 });
  }

  await saveStore((s) => {
    const u = s.users.find((x) => x.id === user.id);
    if (!u) return;
    u.passwordHash = hashPassword(password);
    u.resetTokenHash = undefined;
    u.resetExpiresAt = undefined;
  });
  return NextResponse.json({ message: "تم تغيير كلمة المرور — سجّل دخولك الآن", ok: true });
}