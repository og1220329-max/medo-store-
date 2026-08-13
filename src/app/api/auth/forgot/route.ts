import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();

  if (!email.includes("@")) {
    return NextResponse.json({ message: "أدخل بريدًا إلكترونيًا صحيحًا" }, { status: 422 });
  }

  const store = await getStore();
  const registered = store.users.some(
    (u) => u.email === email || u.email.toLowerCase() === email
  );

  // نسخة تجريبية: إعادة التعيين تعتمد على التواصل مع الدعم
  return NextResponse.json({
    message: registered
      ? "تم استلام طلب إعادة تعيين كلمة المرور. في النسخة التجريبية، تواصل مع الدعم عبر واتساب لإعادة تعيينها."
      : "إذا كان هذا البريد مسجلًا لدينا، سنرسل لك تعليمات إعادة التعيين.",
  });
}