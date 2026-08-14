import { NextResponse } from "next/server";
import { getStore, saveStore } from "@/lib/db/store";
import { cryptoToken, sha256 } from "@/lib/auth";
import { isEmail } from "@/lib/utils";

export const dynamic = "force-dynamic";

const HOUR = 60 * 60 * 1000;

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();

  if (!isEmail(email)) {
    return NextResponse.json({ message: "أدخل بريدًا إلكترونيًا صحيحًا" }, { status: 422 });
  }

  const store = await getStore();
  const user = store.users.find((u) => u.email.toLowerCase() === email);

  if (!user) {
    // لا تكشف ما إذا كان البريد مسجلًا أم لا
    return NextResponse.json({
      message: "إذا كان هذا البريد مسجلًا لدينا، ستصل لك تعليمات إعادة التعيين.",
    });
  }

  const token = cryptoToken(32);
  const tokenHash = sha256(token);
  await saveStore((s) => {
    const u = s.users.find((x) => x.id === user.id);
    if (!u) return;
    u.resetTokenHash = tokenHash;
    u.resetExpiresAt = new Date(Date.now() + HOUR).toISOString();
  });

  // في هذا الإصدار لا يوجد بريد فعلي؛ يُعرض الرابط في الاستجابة لتسهيل الاختبار فقط عند تشغيل التطوير
  const developMode = process.env.NODE_ENV !== "production";

  return NextResponse.json({
    message: "تم إرسال رابط إعادة التعيين إلى بريدك.",
    devResetToken: developMode ? token : undefined,
  });
}