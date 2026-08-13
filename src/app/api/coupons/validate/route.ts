import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handle(request);
}

export async function GET() {
  const store = await getStore();
  return NextResponse.json({ settings: store.settings });
}

async function handle(request: Request) {
  try {
    const body = await request.json();
    const code = String(body.code || "")
      .trim()
      .toUpperCase();
    const subtotal = Number(body.subtotal);

    if (!code) {
      return NextResponse.json({ valid: false, message: "Ø£Ø¯Ø®Ù„ ÙƒÙˆØ¯ Ø§Ù„Ø®ØµÙ…" }, { status: 400 });
    }

    const store = await getStore();
    const coupon = store.coupons.find((c) => c.code.toUpperCase() === code);

    if (!coupon || !coupon.active) {
      return NextResponse.json(
        { valid: false, message: "ÙƒÙˆØ¯ Ø§Ù„Ø®ØµÙ… ØºÙŠØ± ØµØ§Ù„Ø­" },
        { status: 404 }
      );
    }
    if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
      return NextResponse.json(
        { valid: false, message: "Ø§Ù†ØªÙ‡Øª ØµÙ„Ø§Ø­ÙŠØ© Ù‡Ø°Ø§ Ø§Ù„ÙƒÙˆØ¯" },
        { status: 410 }
      );
    }
    if (coupon.used >= coupon.maxUses) {
      return NextResponse.json(
        { valid: false, message: "ØªÙ… Ø§Ø³ØªÙ†ÙØ§Ø¯ Ø§Ø³ØªØ®Ø¯Ø§Ù… Ù‡Ø°Ø§ Ø§Ù„ÙƒÙˆØ¯" },
        { status: 410 }
      );
    }
    if (coupon.minOrder && subtotal < coupon.minOrder) {
      return NextResponse.json(
        {
          valid: false,
          message: `Ù‡Ø°Ø§ Ø§Ù„ÙƒÙˆØ¯ ÙŠØªØ·Ù„Ø¨ Ø·Ù„Ø¨Ù‹Ø§ Ø¨Ù‚ÙŠÙ…Ø© ${coupon.minOrder} Ø¬.Ù… Ø¹Ù„Ù‰ Ø§Ù„Ø£Ù‚Ù„`,
        },
        { status: 422 }
      );
    }

    const discount =
      coupon.type === "percent"
        ? Math.round((subtotal * coupon.value) / 100)
        : Math.min(coupon.value, subtotal);

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount,
    });
  } catch {
    return NextResponse.json({ valid: false, message: "Ø­Ø¯Ø« Ø®Ø·Ø£ ØºÙŠØ± Ù…ØªÙˆÙ‚Ø¹" }, { status: 400 });
  }
}