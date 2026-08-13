import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getStore } from "@/lib/db/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const store = await getStore();
  return NextResponse.json(
    [...store.auditLogs].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 200)
  );
}