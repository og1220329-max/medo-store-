import { NextResponse } from "next/server";
import { getStore, saveStore } from "@/lib/db/store";
import { uid } from "@/lib/utils";

export const dynamic = "force-dynamic";

const HOUR = 60 * 60 * 1000;

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();

  if (!email.includes("@")) {
    return NextResponse.json({ message: "أدخل بريدًا إلكترونيًا صحيحًا" }, { status: 422 });
  }

  const store = await getStore();
  const user = store.users.find(
    (u) => u.email === email || u.email.toLowerCase() === email
  );

  if (!user) {
    return NextResponse.json({
      message: "إذا كان هذا البريد مسجلًا لدينا، ستصل لك تعليمات إعادة التعيين.",
    });
  }

  const token = uid("rst_").replace(/^rst_/, "rst_") + Math.random().toString(36).slice(2, 10);
  let tokenHash = "";
  await saveStore((s) => {
    const u = s.users.find((x) => x.id === user.id);
    if (!u) return;
    tokenHash = token;
    u.resetTokenHash = token;
    u.resetExpiresAt = new Date(Date.now() + HOUR).toISOString();
  });

  return NextResponse.json({
    message: "تم إرسال رابط إعادة التعيين إلى بريدك.",
    // النسخة التجريبية: يُرسل الرابط في الاستجابة ليتسنى اختباره دون بريد حقيقي
    devResetToken: tokenHash,
  });
}