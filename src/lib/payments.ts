import type { Order, PaymentStatus } from "@/lib/types";
import { getStore } from "@/lib/db/store";
import { PAYMENT_METHODS } from "@/lib/constants";

/**
 * طبقة تجريد الدفع (Payment Abstraction)
 * -------------------------------
 * لربط بوابة دفع حقيقية لاحقًا:
 * 1. أضف Gateway جديد ينفذ PaymentGateway
 * 2. سجله في gateways مع البيئة المناسبة
 * 3. غيّر PAYMENT_MODE في متغيرات البيئة
 * بدون أي تعديل على الواجهة الأمامية.
 */

export interface GatewayCreateParams {
  order: Order;
  method: string;
  customer: { name: string; phone: string; email?: string };
}

export interface PaymentResult {
  status: PaymentStatus;
  reference: string;
  message: string;
}

export interface PaymentGateway {
  id: string;
  label: string;
  createPayment(params: GatewayCreateParams): Promise<PaymentResult>;
}

class MockGateway implements PaymentGateway {
  id = "fawry";
  label = "فوري";
  async createPayment(params: GatewayCreateParams): Promise<PaymentResult> {
    await new Promise((r) => setTimeout(r, 1400));
    const reference = `MOCK-${params.order.number}-${Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase()}`;
    return {
      status: "paid",
      reference,
      message: "تم تأكيد الدفع بنجاح (وضع المحاكاة).",
    };
  }
}

class InstantPayGateway implements PaymentGateway {
  id = "instapay";
  label = "إنستا باي";
  async createPayment(params: GatewayCreateParams): Promise<PaymentResult> {
    await new Promise((r) => setTimeout(r, 1400));
    return {
      status: "paid",
      reference: `IP-${params.order.number}-${Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase()}`,
      message: "تم تأكيد الدفع عبر إنستا باي (وضع المحاكاة).",
    };
  }
}

class WalletGateway implements PaymentGateway {
  id = "vodafone";
  label = "فودافون كاش";
  async createPayment(params: GatewayCreateParams): Promise<PaymentResult> {
    await new Promise((r) => setTimeout(r, 1200));
    return {
      status: "paid",
      reference: `VC-${params.order.number}-${Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase()}`,
      message: "تم تأكيد الدفع عبر فودافون كاش (وضع المحاكاة).",
    };
  }
}

class BankTransferGateway implements PaymentGateway {
  id = "bank";
  label = "تحويل بنكي";
  async createPayment(params: GatewayCreateParams): Promise<PaymentResult> {
    await new Promise((r) => setTimeout(r, 1500));
    return {
      status: "paid",
      reference: `BNK-${params.order.number}`,
      message:
        "تم استلام التحويل البنكي بنجاح، وسيتم تأكيد الطلب قبل التنفيذ (وضع المحاكاة).",
    };
  }
}

class CardGateway implements PaymentGateway {
  id = "card";
  label = "بطاقة مصرفية";
  async createPayment(params: GatewayCreateParams): Promise<PaymentResult> {
    await new Promise((r) => setTimeout(r, 1600));
    return {
      status: "paid",
      reference: `CARD-${params.order.number}-${Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase()}`,
      message: "تم إتمام الدفع بالبطاقة المصرفية (وضع المحاكاة).",
    };
  }
}

const gateways: PaymentGateway[] = [
  new MockGateway(),
  new WalletGateway(),
  new InstantPayGateway(),
  new BankTransferGateway(),
  new CardGateway(),
];

export async function isPaymentMethodEnabled(methodId: string): Promise<boolean> {
  const settings = (await getStore()).settings;
  return settings.paymentMethods.includes(methodId) && methodId in PAYMENT_METHODS;
}

export async function getPaymentMethods() {
  const settings = (await getStore()).settings;
  return Object.values(PAYMENT_METHODS).filter((m) =>
    settings.paymentMethods.includes(m.id)
  );
}

export async function processPayment(
  params: GatewayCreateParams
): Promise<PaymentResult> {
  const gateway =
    gateways.find((g) => g.id === params.method) || gateways[0];
  const result = await gateway.createPayment(params);
  const methodMeta = PAYMENT_METHODS[params.method];
  return {
    ...result,
    message: methodMeta
      ? `${methodMeta.name}: ${result.message}`
      : result.message,
  };
}