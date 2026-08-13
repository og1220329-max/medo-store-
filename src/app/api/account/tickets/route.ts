import { NextResponse } from "next/server";
import { getStore, saveStore } from "@/lib/db/store";
import { getSession } from "@/lib/auth";
import { uid } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const store = await getStore();
  const tickets = store.tickets
    .filter((t) => t.userId === session.userId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return NextResponse.json(tickets);
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

    const body = await request.json();
    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();
    const orderNumber = String(body.orderNumber || "").trim() || undefined;

    if (!subject || subject.length < 3) {
      return NextResponse.json({ message: "اكتب موضوع التذكرة" }, { status: 422 });
    }
    if (!message || message.length < 5) {
      return NextResponse.json({ message: "اكتب تفاصيل المشكلة" }, { status: 422 });
    }

    const store = await getStore();
    const user = store.users.find((u) => u.id === session.userId);
    if (!user) return NextResponse.json({ message: "المستخدم غير موجود" }, { status: 404 });

    const seq = store.tickets.length + 1002;
    const now = new Date().toISOString();
    let ticketId = "";
    let ticketNumber = "";

    await saveStore((s) => {
      ticketId = uid("tk_");
      ticketNumber = `TK-${seq}`;
      s.tickets.unshift({
        id: ticketId,
        number: ticketNumber,
        userId: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        subject,
        orderNumber,
        status: "open",
        messages: [
          {
            id: uid("tkm_"),
            fromAdmin: false,
            message,
            createdAt: now,
          },
        ],
        createdAt: now,
        updatedAt: now,
      });
    });

    return NextResponse.json(
      { ticket: { id: ticketId, number: ticketNumber }, ok: true },
      { status: 201 }
    );
  } catch (err) {
    console.error("create ticket error", err);
    return NextResponse.json({ message: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}