import { NextResponse } from "next/server";
import { getStore, saveStore } from "@/lib/db/store";
import { isEmail, uid } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ message: "جميع الحقول مطلوبة" }, { status: 422 });
    }
    if (!isEmail(email)) {
      return NextResponse.json({ message: "أدخل بريدًا إلكترونيًا صحيحًا" }, { status: 422 });
    }

    await saveStore((s) => {
      s.messages.push({
        id: uid("msg_"),
        name,
        email,
        subject,
        message,
        read: false,
        createdAt: new Date().toISOString(),
      });
    });

    return NextResponse.json(
      { message: "تم استلام رسالتك، سيرد عليك فريق الدعم قريبًا" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ message: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}