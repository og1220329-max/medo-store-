import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getStore, saveStore } from "@/lib/db/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const messages = [...(await getStore()).messages].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
  return NextResponse.json(messages);
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const id = String(body.id || "");
  const read = Boolean(body.read);

  let found = false;
  await saveStore((s) => {
    const msg = s.messages.find((m) => m.id === id);
    if (msg) {
      msg.read = read;
      found = true;
    }
  });
  if (!found) return NextResponse.json({ message: "الرسالة غير موجودة" }, { status: 404 });
  return NextResponse.json({ ok: true });
}