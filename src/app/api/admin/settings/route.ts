import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getStore, saveStore } from "@/lib/db/store";
import { adminName, getClientIp, logAudit } from "@/lib/audit";
import type { Settings } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  return NextResponse.json((await getStore()).settings);
}

const SETTING_KEYS: (keyof Settings)[] = [
  "storeName",
  "tagline",
  "currency",
  "email",
  "phone",
  "whatsapp",
  "telegram",
  "facebook",
  "instagram",
  "address",
  "deliveryNote",
  "offerEndsAt",
  "announcement",
];

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const body = await request.json().catch(() => ({}));

  await saveStore((s) => {
    for (const key of SETTING_KEYS) {
      if (key in body && body[key] != null) {
        (s.settings[key] as string) = String(body[key]);
      }
    }
    if (Array.isArray(body.paymentMethods)) {
      const allowed = ["fawry", "vodafone", "instapay", "bank", "card"];
      s.settings.paymentMethods = (body.paymentMethods as string[]).filter((m) =>
        allowed.includes(m)
      );
    }
    logAudit({ adminName: adminName(s, admin.userId), action: "update", entity: "settings", ip: getClientIp(request) }, s);
  });

  return NextResponse.json({ settings: (await getStore()).settings, ok: true });
}