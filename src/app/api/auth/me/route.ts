import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getStore } from "@/lib/db/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }
  const store = await getStore();
  const user =
    session.role === "admin"
      ? { id: "admin", name: "مدير المتجر", email: process.env.ADMIN_EMAIL || "admin@medostore.shop", role: "admin" as const }
      : store.users.find((u) => u.id === session.userId);

  if (!user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}