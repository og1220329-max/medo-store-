import { NextResponse } from "next/server";
import { getStore, saveStore } from "@/lib/db/store";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const store = await getStore();
  const user = store.users.find((u) => u.id === session.userId);
  if (!user) return NextResponse.json({ message: "المستخدم غير موجود" }, { status: 404 });

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      createdAt: user.createdAt,
    },
  });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();

  if (!name || name.length < 2) {
    return NextResponse.json({ message: "يرجى إدخال الاسم الكامل" }, { status: 422 });
  }

  let updated = false;
  await saveStore((s) => {
    const user = s.users.find((u) => u.id === session.userId);
    if (!user) return;
    user.name = name;
    if (phone) user.phone = phone;
    updated = true;
  });
  if (!updated) return NextResponse.json({ message: "المستخدم غير موجود" }, { status: 404 });
  return NextResponse.json({ ok: true });
}