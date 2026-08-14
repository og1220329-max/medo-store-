import type { CartLine, Order, OrderItem, OrderStatus, Product } from "@/lib/types";
import { getStore } from "@/lib/db/store";
import { uid } from "@/lib/utils";

export function generateOrderNumber(): string {
  const rand = Math.floor(100000 + Math.random() * 900000).toString();
  return `MS-${rand}`;
}

export function couponUsable(coupon: {
  active?: boolean;
  used: number;
  maxUses?: number;
  startsAt?: string;
  expiresAt?: string;
}): boolean {
  if (coupon.active === false) return false;
  if (coupon.maxUses !== undefined && coupon.used >= coupon.maxUses) return false;
  const now = Date.now();
  if (coupon.startsAt && new Date(coupon.startsAt).getTime() > now) return false;
  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < now) return false;
  return true;
}

export function orderTotals(
  items: OrderItem[],
  coupon?: {
    type: "percent" | "fixed";
    value: number;
    minOrder?: number;
    maxDiscount?: number;
  }
) {
  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  let discount = 0;
  if (coupon && (!coupon.minOrder || subtotal >= coupon.minOrder)) {
    discount =
      coupon.type === "percent"
        ? Math.round((subtotal * Math.min(coupon.value, 100)) / 100)
        : Math.min(coupon.value, subtotal);
    if (coupon.maxDiscount !== undefined) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
  }
  return {
    subtotal,
    discount,
    total: Math.max(0, subtotal - discount),
  };
}

export async function buildOrderItems(lines: CartLine[]): Promise<{
  items: OrderItem[];
  errors: string[];
}> {
  const store = await getStore();
  const items: OrderItem[] = [];
  const errors: string[] = [];
  for (const line of lines) {
    const product = store.products.find((p) => p.id === line.productId);
    if (!product || !product.active) {
      errors.push(`منتج غير متوفر`);
      continue;
    }
    const quantity = Math.floor(Number(line.quantity));
    if (!Number.isFinite(quantity) || quantity <= 0) {
      errors.push(`كمية غير صالحة لمنتج «${product.name}»`);
      continue;
    }
    if (!product.unlimitedStock && product.stock < quantity) {
      errors.push(`الكمية المطلوبة من «${product.name}» غير متوفرة حاليًا`);
      continue;
    }
    items.push({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity,
      customData: line.customData || {},
    });
  }
  return { items, errors };
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
    coupon && couponUsable(coupon)
      ? {
          type: coupon.type,
          value: coupon.value,
          minOrder: coupon.minOrder,
          maxDiscount: coupon.maxDiscount,
        }
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