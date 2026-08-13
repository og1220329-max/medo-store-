import { NextResponse } from "next/server";
import { getStore, saveStore } from "@/lib/db/store";
import { hashPassword } from "@/lib/auth";
import { isEmail } from "@/lib/utils";
import { uid } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim();
    const password = String(body.password || "");

    if (name.length < 2) return NextResponse.json({ message: "أدخل الاسم الكامل" }, { status: 422 });
    if (!isEmail(email)) return NextResponse.json({ message: "أدخل بريدًا إلكترونيًا صحيحًا" }, { status: 422 });
    if (password.length < 8) return NextResponse.json({ message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" }, { status: 422 });

    const store = await getStore();

    const admin = (process.env.ADMIN_EMAIL || "admin@medostore.shop").toLowerCase();
    if (email === admin) {
      return NextResponse.json({ message: "هذا البريد محجوز للمتجر" }, { status: 422 });
    }

    if (store.users.some((u) => u.email === email)) {
      return NextResponse.json({ message: "هذا البريد مسجل بالفعل" }, { status: 409 });
    }

    const user = {
      id: uid("usr_"),
      name,
      email,
      phone: phone || undefined,
      passwordHash: hashPassword(password),
      role: "customer" as const,
      active: true,
      createdAt: new Date().toISOString(),
    };
    await saveStore((s) => {
      s.users.push(user);
    });

    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}