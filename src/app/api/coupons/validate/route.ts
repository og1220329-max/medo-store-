import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import { couponUsable } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = String(body.code || "")
      .trim()
      .toUpperCase();
    const subtotal = Number(body.subtotal);
    const subtotalValid = Number.isFinite(subtotal) && subtotal >= 0;

    if (!code) {
      return NextResponse.json(
        { valid: false, message: "أدخل كود الخصم" },
        { status: 400 }
      );
    }
    if (!subtotalValid) {
      return NextResponse.json(
        { valid: false, message: "قيمة الطلب غير صحيحة" },
        { status: 400 }
      );
    }

    const store = await getStore();
    const coupon = store.coupons.find((c) => c.code.toUpperCase() === code);

    if (!coupon || coupon.active === false) {
      return NextResponse.json(
        { valid: false, message: "كود الخصم غير صالح" },
        { status: 404 }
      );
    }
    if (!couponUsable(coupon)) {
      if (coupon.startsAt && new Date(coupon.startsAt).getTime() > Date.now()) {
        return NextResponse.json(
          { valid: false, message: "هذا الكود لم يبدأ تفعيله بعد" },
          { status: 410 }
        );
      }
      if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
        return NextResponse.json(
          { valid: false, message: "انتهت صلاحية هذا الكود" },
          { status: 410 }
        );
      }
      return NextResponse.json(
        { valid: false, message: "تم استنفاد استخدام هذا الكود" },
        { status: 410 }
      );
    }
    if (coupon.minOrder && subtotal < coupon.minOrder) {
      return NextResponse.json(
        {
          valid: false,
          message: `هذا الكود يتطلب طلبًا بقيمة ${coupon.minOrder} ج.م على الأقل`,
        },
        { status: 422 }
      );
    }

    const percent = coupon.type === "percent";
    const rawDiscount = percent
      ? Math.round((subtotal * Math.min(coupon.value, 100)) / 100)
      : Math.min(coupon.value, subtotal);
    const maxDiscount = coupon.maxDiscount;
    const discount =
      maxDiscount !== undefined ? Math.min(rawDiscount, maxDiscount) : rawDiscount;

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount,
    });
  } catch {
    return NextResponse.json(
      { valid: false, message: "حدث خطأ غير متوقع" },
      { status: 400 }
    );
  }
}