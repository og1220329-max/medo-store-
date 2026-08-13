import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import { normalizePhone } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const number = String(body.number || "").trim().toUpperCase();
    const phone = normalizePhone(String(body.phone || "").trim());

    if (!number || !phone) {
      return NextResponse.json(
        { message: "أدخل رقم الطلب ورقم الهاتف" },
        { status: 422 }
      );
    }

    const store = await getStore();
    const order = store.orders.find(
      (o) => o.number.toUpperCase() === number && o.customer.phone === phone
    );

    if (!order) {
      return NextResponse.json(
        { message: "لم يتم العثور على طلب بهذه البيانات" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      order: {
        number: order.number,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        total: order.total,
        paymentStatus: order.payment.status,
        paymentMethod: order.payment.method,
        items: order.items,
        timeline: order.timeline,
        customer: {
          name: order.customer.name,
          phone: order.customer.phone,
        },
      },
    });
  } catch {
    return NextResponse.json({ message: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}