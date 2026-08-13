import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getStore, saveStore } from "@/lib/db/store";
import type { HomepageSection } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  return NextResponse.json((await getStore()).homepage);
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const sections = Array.isArray(body.sections) ? body.sections : [];

  let updated: HomepageSection[] = [];
  await saveStore((s) => {
    for (const item of sections) {
      const key = String(item.key || "");
      if (!key) continue;
      const existing = s.homepage.find((h) => h.key === key);
      if (!existing) continue;
      if (item.enabled != null) existing.enabled = Boolean(item.enabled);
      if (item.title != null) existing.title = String(item.title).trim() || undefined;
      if (item.subtitle != null)
        existing.subtitle = String(item.subtitle).trim() || undefined;
      if (item.order != null) existing.order = Math.max(0, Number(item.order));
      updated.push({ ...existing });
    }
  });
  return NextResponse.json({ sections: updated, ok: true });
}