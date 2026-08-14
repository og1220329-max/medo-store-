import { NextResponse } from "next/server";
import { getStore, saveStore } from "@/lib/db/store";
import { getSession } from "@/lib/auth";
import { buildOrderItems, createOrder, pushTimeline } from "@/lib/orders";
import { isPaymentMethodEnabled, processPayment } from "@/lib/payments";
import { isEgyptianPhone, normalizePhone } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session = await getSession();

    const customer = {
      name: String(body.name || "").trim(),
      phone: normalizePhone(String(body.phone || "").trim()),
      email: String(body.email || "").trim() || undefined,
      notes: String(body.notes || "").trim() || undefined,
    };

    if (!customer.name || customer.name.length < 2) {
      return NextResponse.json({ message: "يرجى إدخال الاسم الكامل" }, { status: 422 });
    }
    if (!isEgyptianPhone(customer.phone)) {
      return NextResponse.json(
        { message: "يرجى إدخال رقم هاتف مصري صحيح (01…)" },
        { status: 422 }
      );
    }

    const lines = Array.isArray(body.items) ? body.items : [];
    if (lines.length === 0) {
      return NextResponse.json({ message: "السلة فارغة" }, { status: 422 });
    }

    const { items, errors } = await buildOrderItems(
      lines.map((l: { productId?: unknown; quantity?: unknown; customData?: unknown }) => ({
        productId: String(l.productId || ""),
        quantity: Number(l.quantity),
        customData:
          l.customData && typeof l.customData === "object"
            ? (l.customData as Record<string, string>)
            : {},
      }))
    );
    if (items.length === 0) {
      return NextResponse.json(
        { message: errors[0] || "لا توجد منتجات صالحة في الطلب" },
        { status: 422 }
      );
    }
    if (errors.length > 0) {
      return NextResponse.json({ message: errors[0] }, { status: 422 });
    }

    const paymentMethod = String(body.paymentMethod || "");
    if (!(await isPaymentMethodEnabled(paymentMethod))) {
      return NextResponse.json(
        { message: "طريقة الدفع غير متاحة" },
        { status: 422 }
      );
    }

    const couponCode =
      typeof body.couponCode === "string" && body.couponCode.trim()
        ? body.couponCode.trim().toUpperCase()
        : undefined;

    const order = await createOrder({
      customer,
      items,
      couponCode,
      paymentMethod,
      userId: session?.userId,
    });

    const payment = await processPayment({
      order,
      method: paymentMethod,
      customer,
    });

    if (payment.status === "paid") {
      order.payment.status = "paid";
      order.payment.reference = payment.reference;
      order.payment.paidAt = new Date().toISOString();
      pushTimeline(order, "paid");
    } else {
      order.payment.reference = payment.reference || "";
    }

    await saveStore((s) => {
      s.orders.unshift(order);

      // تحديث استخدام الكوبون
      if (order.couponCode) {
        s.coupons.forEach((c) => {
          if (
            c.code.toUpperCase() === order.couponCode!.toUpperCase() &&
            c.used < c.maxUses
          ) {
            c.used += 1;
          }
        });
      }
    });

    return NextResponse.json(
      {
        order: {
          id: order.id,
          number: order.number,
          status: order.status,
          paymentStatus: order.payment.status,
          total: order.total,
          subtotal: order.subtotal,
          discount: order.discount,
          items: order.items,
          message: payment.message,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("create order error", err);
    return NextResponse.json(
      { message: "حدث خطأ أثناء إنشاء الطلب، حاول مرة أخرى" },
      { status: 500 }
    );
  }
}