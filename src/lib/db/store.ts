import { PrismaClient } from "@prisma/client";
import type {
  Store,
  User,
  Product,
  Order,
  OrderItem,
  Coupon,
  Review,
  SupportMessage,
  Ticket,
  Notification,
  Banner,
  HomepageSection,
  Offer,
  PaymentRecord,
  RoleInfo,
  AuditLog,
} from "@/lib/types";
import { buildSeed } from "@/lib/db/seed";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

let cache: Store | null = null;
let hydrating: Promise<Store> | null = null;

// ============ تحويلات الكيانات ============

function toOrder(row: {
  id: string;
  number: string;
  userId: string | null;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  subtotal: number;
  discount: number;
  total: number;
  couponCode: string | null;
  paymentMethod: string;
  paymentStatus: string;
  reference: string | null;
  paidAt: string | null;
  status: string;
  timeline: unknown;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
  items: { productId: string | null; name: string; image: string | null; price: number; quantity: number; customData: unknown }[];
}): Order {
  return {
    id: row.id,
    number: row.number,
    userId: row.userId || undefined,
    customer: {
      name: row.name,
      phone: row.phone,
      email: row.email || undefined,
      notes: row.notes || undefined,
    },
    items: row.items.map((it) => ({
      productId: it.productId || "",
      name: it.name,
      image: it.image || "",
      price: it.price,
      quantity: it.quantity,
      customData: (it.customData as Record<string, string>) || {},
    })),
    subtotal: row.subtotal,
    discount: row.discount,
    total: row.total,
    couponCode: row.couponCode || undefined,
    payment: {
      method: row.paymentMethod,
      status: (row.paymentStatus as Order["payment"]["status"]) || "pending",
      reference: row.reference || "",
      paidAt: row.paidAt || undefined,
    },
    status: row.status as Order["status"],
    timeline: (row.timeline as Order["timeline"]) || [],
    adminNotes: row.adminNotes || undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function toProduct(row: {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  description: string;
  shortDescription: string | null;
  categoryId: string;
  image: string;
  images: unknown;
  price: number;
  oldPrice: number | null;
  costPrice: number | null;
  stock: number;
  unlimitedStock: boolean;
  active: boolean;
  featured: boolean;
  bestSeller: boolean;
  isNew: boolean;
  deliveryTime: string;
  type: string;
  features: unknown;
  requiredFields: unknown;
  rating: number;
  reviewsCount: number;
  badge: string | null;
  createdAt: string;
}): Product {
  return {
    id: row.id,
    slug: row.slug,
    sku: row.sku || undefined,
    name: row.name,
    description: row.description,
    shortDescription: row.shortDescription || undefined,
    categoryId: row.categoryId,
    image: row.image,
    images: (row.images as string[]) || undefined,
    price: row.price,
    oldPrice: row.oldPrice || undefined,
    costPrice: row.costPrice || undefined,
    stock: row.stock,
    unlimitedStock: row.unlimitedStock,
    rating: row.rating,
    reviewsCount: row.reviewsCount,
    featured: row.featured,
    bestSeller: row.bestSeller,
    isNew: row.isNew,
    type: row.type,
    active: row.active,
    deliveryTime: row.deliveryTime,
    features: (row.features as string[]) || [],
    requiredFields: (row.requiredFields as Product["requiredFields"]) || [],
    badge: row.badge || undefined,
    createdAt: row.createdAt,
  };
}

// ============ القراءة ============

async function readSnapshot(): Promise<Store | null> {
  let settingsRows = 0;
  try {
    settingsRows = await prisma.setting.count();
  } catch {
    // DB tables don't exist yet (e.g. fresh deployment before migration)
    return null;
  }
  if (settingsRows === 0) return null;


  const [roles, users, categories, products, orders, payments, coupons, reviews, messages, tickets, ticketMessages, notifications, banners, homepage, offers, auditLogs, settingsRowsData] = await Promise.all([
    prisma.role.findMany(),
    prisma.user.findMany(),
    prisma.category.findMany(),
    prisma.product.findMany(),
    prisma.order.findMany({ include: { items: true } }),
    prisma.payment.findMany(),
    prisma.coupon.findMany(),
    prisma.review.findMany(),
    prisma.supportMessage.findMany(),
    prisma.ticket.findMany(),
    prisma.ticketMessage.findMany(),
    prisma.notification.findMany(),
    prisma.banner.findMany(),
    prisma.homepageSection.findMany(),
    prisma.offer.findMany(),
    prisma.auditLog.findMany(),
    prisma.setting.findMany(),
  ]);

  const supportMessages = messages;

  const settingsVal = settingsRowsData.find((r) => r.key === "site");
  return {
    roles: roles.map((r) => ({ id: r.id, name: r.name, description: r.description || undefined, permissions: (r.permissions as string[]) || [], isSystem: r.isSystem, createdAt: r.createdAt })) as RoleInfo[],
    users: users as unknown as User[],
    categories: categories as unknown as Store["categories"],
    products: products.map(toProduct),
    orders: orders.map((o) => toOrder(o as never)),
    payments: payments as unknown as PaymentRecord[],
    coupons: coupons as unknown as Coupon[],
    reviews: reviews.map((r) => ({
      id: r.id,
      productId: r.productId || "",
      orderId: r.orderId || undefined,
      userId: r.userId || undefined,
      name: r.name,
      rating: r.rating,
      text: r.comment,
      date: r.createdAt,
      product: undefined,
      verified: r.verified,
      approved: r.approved,
      featured: r.featured,
    })) as Review[],
    messages: supportMessages,
    tickets: tickets.map((t) => {
      const msgs = ticketMessages.filter((m) => m.ticketId === t.id);
      return {
        ...t,
        userId: t.userId || undefined,
        email: t.email || undefined,
        phone: t.phone || undefined,
        orderNumber: t.orderNumber || undefined,
        messages: msgs.map((m) => ({ id: m.id, fromAdmin: m.fromAdmin, message: m.message, createdAt: m.createdAt })),
      } as Ticket;
    }),
    notifications: notifications as unknown as Notification[],
    banners: banners as unknown as Banner[],
    homepage: homepage.map((h) => ({ key: h.key, name: h.name, enabled: h.enabled, title: h.title || undefined, subtitle: h.subtitle || undefined, order: h.order })) as HomepageSection[],
    offers: offers.map((o) => ({ ...o, image: o.image || undefined, badge: o.badge || undefined, productIds: (o.productIds as string[]) || [] })) as Offer[],
    auditLogs: auditLogs as unknown as AuditLog[],
    settings: (settingsVal?.value as unknown as Store["settings"]) || buildSeed().settings,
  };
}

// ============ الكتابة ============

async function writeSnapshot(store: Store): Promise<void> {
  const orderRows = store.orders.map((o) => ({
    id: o.id,
    number: o.number,
    userId: o.userId || null,
    name: o.customer.name,
    phone: o.customer.phone,
    email: o.customer.email || null,
    notes: o.customer.notes || null,
    subtotal: o.subtotal,
    discount: o.discount,
    total: o.total,
    couponCode: o.couponCode || null,
    paymentMethod: o.payment.method,
    paymentStatus: o.payment.status,
    reference: o.payment.reference || null,
    paidAt: o.payment.paidAt || null,
    status: o.status,
    timeline: o.timeline as never,
    adminNotes: o.adminNotes || null,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  }));
  const itemRows = store.orders.flatMap((o) =>
    o.items.map((it) => ({
      id: `it_${o.id}_${it.productId}_${it.quantity}`,
      orderId: o.id,
      productId: it.productId || null,
      name: it.name,
      image: it.image || null,
      price: it.price,
      quantity: it.quantity,
      customData: (it.customData || {}) as never,
    }))
  );

  await prisma.$transaction(async (tx) => {
    await tx.orderItem.deleteMany();
    await tx.payment.deleteMany();
    await tx.review.deleteMany();
    await tx.order.deleteMany();
    await tx.ticketMessage.deleteMany();
    await tx.ticket.deleteMany();
    await tx.notification.deleteMany();
    await tx.user.deleteMany();
    await tx.product.deleteMany();
    await tx.category.deleteMany();
    await tx.role.deleteMany();
    await tx.supportMessage.deleteMany();
    await tx.coupon.deleteMany();
    await tx.banner.deleteMany();
    await tx.homepageSection.deleteMany();
    await tx.offer.deleteMany();
    await tx.auditLog.deleteMany();
    await tx.setting.deleteMany();
    await tx.role.createMany({ data: store.roles.map((r) => ({ id: r.id, name: r.name, description: r.description || null, permissions: r.permissions as never, isSystem: r.isSystem, createdAt: r.createdAt })) });
    await tx.user.createMany({ data: store.users.map((u) => ({ id: u.id, name: u.name, email: u.email, phone: u.phone || null, passwordHash: u.passwordHash || "", role: u.role, roleId: u.roleId || null, active: u.active, resetTokenHash: u.resetTokenHash || null, resetExpiresAt: u.resetExpiresAt || null, lastLoginAt: u.lastLoginAt || null, createdAt: u.createdAt })) });
    await tx.category.createMany({ data: store.categories.map((c) => ({ id: c.id, slug: c.slug, name: c.name, description: c.description || null, icon: c.icon, image: c.image, parentId: c.parentId || null, order: c.order, active: c.active, createdAt: c.createdAt })) });
    await tx.product.createMany({ data: store.products.map((p) => ({ id: p.id, slug: p.slug, sku: p.sku || null, name: p.name, description: p.description, shortDescription: p.shortDescription || null, categoryId: p.categoryId, image: p.image, images: (p.images || []) as never, price: p.price, oldPrice: p.oldPrice || null, costPrice: p.costPrice || null, stock: p.stock, unlimitedStock: p.unlimitedStock ?? false, active: p.active, featured: p.featured ?? false, bestSeller: p.bestSeller ?? false, isNew: p.isNew ?? false, deliveryTime: p.deliveryTime, type: p.type || "digital", features: p.features as never, requiredFields: p.requiredFields as never, rating: p.rating, reviewsCount: p.reviewsCount, badge: p.badge || null, createdAt: p.createdAt })) });
    await tx.order.createMany({ data: orderRows });
    await tx.orderItem.createMany({ data: itemRows });
    await tx.payment.createMany({ data: store.payments.map((p) => ({ id: p.id, orderId: p.orderId, method: p.method, status: p.status, amount: p.amount, reference: p.reference || null, createdAt: p.createdAt, paidAt: p.paidAt || null })) });
    await tx.coupon.createMany({ data: store.coupons.map((c) => ({ id: c.id, code: c.code, type: c.type, value: c.value, minOrder: c.minOrder || null, maxDiscount: c.maxDiscount || null, startsAt: c.startsAt || null, expiresAt: c.expiresAt || null, maxUses: c.maxUses, perUserLimit: c.perUserLimit || 0, active: c.active, used: c.used, createdAt: c.createdAt })) });
    await tx.review.createMany({ data: store.reviews.map((r) => ({ id: r.id, productId: r.productId || "", orderId: r.orderId || null, userId: r.userId || null, name: r.name, rating: r.rating, comment: r.text, verified: r.verified ?? false, approved: r.approved ?? true, featured: r.featured ?? false, createdAt: r.date })) });
    await tx.ticket.createMany({ data: store.tickets.map((t) => ({ id: t.id, number: t.number, userId: t.userId || null, name: t.name, email: t.email || null, phone: t.phone || null, subject: t.subject, orderNumber: t.orderNumber || null, status: t.status, createdAt: t.createdAt, updatedAt: t.updatedAt })) });
    await tx.supportMessage.createMany({ data: store.messages.map((m) => ({ id: m.id, name: m.name, email: m.email, subject: m.subject, message: m.message, read: m.read, createdAt: m.createdAt })) });
    await tx.ticketMessage.createMany({ data: store.tickets.flatMap((t) => t.messages.map((m) => ({ id: m.id, ticketId: t.id, fromAdmin: m.fromAdmin, message: m.message, createdAt: m.createdAt }))) });
    await tx.notification.createMany({ data: store.notifications.map((n) => ({ id: n.id, userId: n.userId || null, type: n.type, title: n.title, body: n.body || null, link: n.link || null, read: n.read, createdAt: n.createdAt })) });
    await tx.banner.createMany({ data: store.banners.map((b) => ({ id: b.id, title: b.title, subtitle: b.subtitle || null, image: b.image, buttonText: b.buttonText || null, buttonUrl: b.buttonUrl || null, startsAt: b.startsAt || null, endsAt: b.endsAt || null, active: b.active, order: b.order, createdAt: b.createdAt })) });
    await tx.homepageSection.createMany({ data: store.homepage.map((h) => ({ key: h.key, name: h.name, enabled: h.enabled, title: h.title || null, subtitle: h.subtitle || null, order: h.order })) });
    await tx.offer.createMany({ data: store.offers.map((o) => ({ id: o.id, title: o.title, description: o.description || null, badge: o.badge || null, image: o.image || null, discountPct: o.discountPct || null, productIds: o.productIds as never, startsAt: o.startsAt || null, endsAt: o.endsAt || null, active: o.active, order: o.order, createdAt: o.createdAt })) });
    await tx.auditLog.createMany({ data: store.auditLogs.map((a) => ({ id: a.id, adminName: a.adminName, action: a.action, entity: a.entity, entityId: a.entityId || null, details: (a.details || null) as never, ip: a.ip || null, createdAt: a.createdAt })) });
    await tx.setting.create({ data: { key: "site", value: store.settings as never } });
  }, { timeout: 20000 });
}

// ============ الواجهة العامة ============

async function hydrate(): Promise<Store> {
  const snapshot = await readSnapshot();
  if (snapshot) {
    cache = snapshot;
    return snapshot;
  }
  const seed = buildSeed();
  cache = seed;
  // During Vercel build-time prerendering the DB tables may not exist yet,
  // so we silently skip the write and return the in-memory seed instead.
  try {
    await writeSnapshot(seed);
  } catch (e) {
    console.warn('[store] writeSnapshot skipped (DB not ready):', (e as Error).message);
  }
  return seed;
}

export async function getStore(): Promise<Store> {
  if (cache) return cache;
  if (hydrating) return hydrating;
  hydrating = hydrate().finally(() => {
    hydrating = null;
  });
  return hydrating;
}

export async function saveStore(mutator: (store: Store) => void): Promise<void> {
  const store = await getStore();
  mutator(store);
  await writeSnapshot(store);
}

export async function saveStoreAsync(
  mutator: (store: Store) => void | Promise<void>
): Promise<void> {
  const store = await getStore();
  await mutator(store);
  await writeSnapshot(store);
}

export async function resetStore(): Promise<Store> {
  cache = null;
  const seed = buildSeed();
  cache = seed;
  await writeSnapshot(seed);
  return seed;
}

export type { Store, User, Product, Order, OrderItem, Coupon, Review, SupportMessage, Ticket, Notification, Banner, HomepageSection, Offer, PaymentRecord, RoleInfo, AuditLog };