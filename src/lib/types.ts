export type Role = "customer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash?: string;
  role: Role;
  roleId?: string;
  active: boolean;
  resetTokenHash?: string;
  resetExpiresAt?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  image: string;
  parentId?: string;
  order: number;
  active: boolean;
  createdAt: string;
}

export interface RequiredField {
  key: string;
  label: string;
  type: "text" | "select" | "number";
  placeholder?: string;
  required?: boolean;
  options?: string[];
  hint?: string;
}

export interface Product {
  id: string;
  slug: string;
  sku?: string;
  name: string;
  description: string;
  shortDescription?: string;
  categoryId: string;
  image: string;
  images?: string[];
  price: number;
  oldPrice?: number;
  costPrice?: number;
  stock: number;
  unlimitedStock?: boolean;
  rating: number;
  reviewsCount: number;
  featured?: boolean;
  bestSeller?: boolean;
  isNew?: boolean;
  type?: string;
  active: boolean;
  deliveryTime: string;
  features: string[];
  requiredFields: RequiredField[];
  badge?: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  customData: Record<string, string>;
}

export type OrderStatus =
  | "created"
  | "paid"
  | "processing"
  | "executing"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Payment {
  method: string;
  status: PaymentStatus;
  reference: string;
  paidAt?: string;
}

export interface Order {
  id: string;
  number: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    notes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
  payment: Payment;
  status: OrderStatus;
  timeline: { status: OrderStatus; at: string }[];
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  minOrder?: number;
  maxDiscount?: number;
  startsAt?: string;
  maxUses: number;
  perUserLimit?: number;
  used: number;
  expiresAt?: string;
  active: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  product?: string;
  productId?: string;
  orderId?: string;
  userId?: string;
  verified?: boolean;
  approved?: boolean;
  featured?: boolean;
}

export interface SupportMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export type TicketStatus =
  | "open"
  | "in_progress"
  | "waiting"
  | "resolved"
  | "closed";

export interface Ticket {
  id: string;
  number: string;
  userId?: string;
  name: string;
  email?: string;
  phone?: string;
  subject: string;
  orderNumber?: string;
  status: TicketStatus;
  messages: { id: string; fromAdmin: boolean; message: string; createdAt: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId?: string;
  type: string;
  title: string;
  body?: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  buttonText?: string;
  buttonUrl?: string;
  startsAt?: string;
  endsAt?: string;
  active: boolean;
  order: number;
  createdAt: string;
}

export interface HomepageSection {
  key: string;
  name: string;
  enabled: boolean;
  title?: string;
  subtitle?: string;
  order: number;
}

export interface Offer {
  id: string;
  title: string;
  description?: string;
  badge?: string;
  image?: string;
  discountPct?: number;
  productIds: string[];
  startsAt?: string;
  endsAt?: string;
  active: boolean;
  order: number;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  orderNumber: string;
  method: string;
  status: PaymentStatus;
  amount: number;
  reference?: string;
  createdAt: string;
  paidAt?: string;
}

export interface RoleInfo {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  isSystem: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  adminName: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: Record<string, unknown>;
  ip?: string;
  createdAt: string;
}

export interface Settings {
  storeName: string;
  tagline: string;
  currency: string;
  email: string;
  phone: string;
  whatsapp: string;
  telegram: string;
  facebook: string;
  instagram: string;
  tiktok?: string;
  address: string;
  deliveryNote: string;
  offerEndsAt: string;
  announcement: string;
  paymentMethods: string[];
  logoUrl?: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogImage: string;
  };
  checkout: {
    minOrderAmount: number;
    maxOrderAmount?: number;
    guestCheckout: boolean;
    couponEnabled: boolean;
  };
  notifications: {
    customerOnOrder: boolean;
    customerOnPayment: boolean;
    customerOnStatus: boolean;
    adminOnNewOrder: boolean;
    adminOnNewTicket: boolean;
    emailEnabled: boolean;
  };
}

export interface Store {
  users: User[];
  categories: Category[];
  products: Product[];
  orders: Order[];
  payments: PaymentRecord[];
  coupons: Coupon[];
  reviews: Review[];
  messages: SupportMessage[];
  tickets: Ticket[];
  notifications: Notification[];
  banners: Banner[];
  homepage: HomepageSection[];
  offers: Offer[];
  roles: RoleInfo[];
  auditLogs: AuditLog[];
  settings: Settings;
}

export interface CartLine {
  productId: string;
  quantity: number;
  customData: Record<string, string>;
}

export interface CartLineDetailed extends CartLine {
  product: Product;
}