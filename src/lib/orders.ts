import type { CartLine, Order, OrderItem, OrderStatus, Product } from "@/lib/types";
import { getStore } from "@/lib/db/store";
import { uid } from "@/lib/utils";

export function generateOrderNumber(): string {
  const rand = Math.floor(100000 + Math.random() * 900000).toString();
  return `MS-${rand}`;
}

export function orderTotals(items: OrderItem[], coupon?: { type: "percent" | "fixed"; value: number; minOrder?: number }) {
  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  let discount = 0;
  if (coupon && (!coupon.minOrder || subtotal >= coupon.minOrder)) {
    discount =
      coupon.type === "percent"
        ? Math.round((subtotal * coupon.value) / 100)
        : Math.min(coupon.value, subtotal);
  }
  return {
    subtotal,
    discount,
    total: Math.max(0, subtotal - discount),
  };
}

export async function buildOrderItems(lines: CartLine[]): Promise<OrderItem[]> {
  const store = await getStore();
  const items: OrderItem[] = [];
  for (const line of lines) {
    const product = store.products.find((p) => p.id === line.productId);
    if (!product || !product.active) continue;
    items.push({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: line.quantity,
      customData: line.customData || {},
    });
  }
  return items;
}

export async function createOrder(input: {
  customer: Order["customer"];
  items: OrderItem[];
  couponCode?: string;
  paymentMethod: string;
  userId?: string;
}): Promise<Order> {
  const store = await getStore();
  const coupon = input.couponCode
    ? store.coupons.find(
        (c) => c.code.toLowerCase() === input.couponCode!.toLowerCase()
      )
    : undefined;
  const ticket =
    coupon && coupon.active && coupon.used < coupon.maxUses
      ? { type: coupon.type, value: coupon.value, minOrder: coupon.minOrder }
      : undefined;

  const { subtotal, discount, total } = orderTotals(input.items, ticket);

  const now = new Date().toISOString();
  const order: Order = {
    id: uid("ord_"),
    number: generateOrderNumber(),
    customer: input.customer,
    items: input.items,
    subtotal,
    discount,
    total,
    couponCode: ticket ? input.couponCode : undefined,
    payment: {
      method: input.paymentMethod,
      status: "pending",
      reference: "",
    },
    status: "created",
    timeline: [{ status: "created", at: now }],
    createdAt: now,
    updatedAt: now,
    userId: input.userId,
  };
  return order;
}

export function pushTimeline(order: Order, status: OrderStatus) {
  if (order.status === status) return;
  order.status = status;
  order.updatedAt = new Date().toISOString();
  order.timeline.push({ status, at: order.updatedAt });
  if (status === "paid") {
    order.payment.status = "paid";
    order.payment.paidAt = order.updatedAt;
  }
}

export function nextStatus(status: OrderStatus): OrderStatus | null {
  const flow: OrderStatus[] = [
    "created",
    "paid",
    "processing",
    "executing",
    "delivered",
  ];
  const idx = flow.indexOf(status);
  if (idx < 0 || idx >= flow.length - 1) return null;
  return flow[idx + 1];
}

export async function findProductById(id: string): Promise<Product | undefined> {
  return (await getStore()).products.find((p) => p.id === id);
}