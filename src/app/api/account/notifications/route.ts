import { NextResponse } from "next/server";
import { getStore, saveStore } from "@/lib/db/store";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const store = await getStore();
  const items = store.notifications
    .filter((n) => !n.userId || n.userId === session.userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({
    items,
    unread: items.filter((n) => !n.read).length,
  });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  await saveStore((s) => {
    s.notifications.forEach((n) => {
      if (!n.userId || n.userId === session.userId) n.read = true;
    });
  });
  void body;
  return NextResponse.json({ ok: true });
}