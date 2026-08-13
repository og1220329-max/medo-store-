import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const now = Date.now();
  const banners = (await getStore()).banners.filter(
    (b) =>
      b.active &&
      (!b.startsAt || new Date(b.startsAt).getTime() <= now) &&
      (!b.endsAt || new Date(b.endsAt).getTime() >= now)
  );
  return NextResponse.json(banners.sort((a, b) => a.order - b.order));
}