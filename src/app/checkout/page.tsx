"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CreditCard,
  Landmark,
  Loader2,
  MessageSquare,
  ShieldCheck,
  Smartphone,
  TicketPercent,
  Wallet,
} from "lucide-react";
import { useCart } from "@/store/cart";
import { useToast } from "@/store/toast";
import { formatPrice, isEgyptianPhone, normalizePhone } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/common";
import { Button, Field, Input, Textarea } from "@/components/ui/primitives";

const METHOD_ICONS: Record<string, typeof CreditCard> = {
  fawry: Smartphone,
  vodafone: Smartphone,
  instapay: Smartphone,
  bank: Landmark,
  card: CreditCard,
};

const METHOD_COLORS: Record<string, string> = {
  fawry: "#fb7185",
  vodafone: "#f43f5e",
  instapay: "#a78bfa",
  bank: "#38bdf8",
  card: "#22d3ee",
};

interface CouponState {
  code?: string;
  discount: number;
  message?: string;
  error?: string;
}

export default function CheckoutPage() {
  const cart = useCart();
  const toast = useToast();
  const router = useRouter();

  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [methods, setMethods] = useState<string[]>([]);
  const [coupon, setCoupon] = useState<CouponState>({ discount: 0 });
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (cart.lines.length === 0 && !submitting) {
      router.replace("/products");
      return;
    }
    fetch("/api/site", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.settings?.paymentMethods?.length) {
          setMethods(data.settings.paymentMethods);
          setPaymentMethod((prev) =>
            prev || data.settings.paymentMethods[0]
          );
        }
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const discount = coupon.discount;
  const total = Math.max(0, cart.subtotal - discount);

  const applyCoupon = async () => {
    const code = couponInput.trim();
    if (!code) return;
    setCouponLoading(true);
    setCoupon({ discount: 0 });
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal: cart.subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setCoupon({ code: data.code, discount: data.discount, message: "تم تطبيق الخصم" });
        toast.success("تم تطبيق الكود", `خصم ${formatPrice(data.discount)}`);
      } else {
        setCoupon({ discount: 0, error: data.message });
        toast.error("الكود غير صالح", data.message);
      }
    } catch {
      setCoupon({ discount: 0, error: "حدث خطأ، حاول مرة أخرى" });
    } finally {
      setCouponLoading(false);
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = "أدخل الاسم الكامل";
    if (!isEgyptianPhone(normalizePhone(form.phone))) e.phone = "أدخل رقم هاتف مصري صحيح";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "بريد غير صحيح";
    if (!paymentMethod) e.payment = "اختر طريقة الدفع";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) {
      toast.error("تحقق من البيانات", "بعض الحقول غير مكتملة");
      return;
    }
    if (cart.lines.length === 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: normalizePhone(form.phone),
          email: form.email,
          notes: form.notes,
          items: cart.lines.map((l) => ({
            productId: l.productId,
            quantity: l.quantity,
            customData: l.customData,
          })),
          paymentMethod,
          couponCode: coupon.code,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error("فشل إنشاء الطلب", data.message || "حاول مجددًا");
        setSubmitting(false);
        return;
      }
      cart.clearCart();
      router.push(
        `/checkout/success?order=${encodeURIComponent(data.order.number)}&phone=${encodeURIComponent(form.phone)}`
      );
    } catch {
      toast.error("خطأ في الاتصال", "تأكد من اتصالك وحاول مرة أخرى");
      setSubmitting(false);
    }
  };

  const summary = useMemo(
    () => cart.lines.map((l) => ({ name: l.product.name, qty: l.quantity, price: l.product.price * l.quantity })),
    [cart.lines]
  );

  const myMethods = methods.map((id) => {
    const meta: Record<string, { name: string; desc: string }> = {
      fawry: { name: "فوري", desc: "الدفع من أي منفذ فوري" },
      vodafone: { name: "فودافون كاش", desc: "الدفع عبر محفظة فودافون" },
      instapay: { name: "إنستا باي", desc: "تحويل عبر تطبيق إنستا باي" },
      bank: { name: "تحويل بنكي", desc: "إيداع على الحساب البنكي" },
      card: { name: "بطاقة مصرفية", desc: "فيزا / ماستركارد / ميزة" },
    };
    const m = meta[id];
    const Icon = METHOD_ICONS[id] || Wallet;
    const color = METHOD_COLORS[id] || "#a78bfa";
    return { id, name: m.name, desc: m.desc, Icon, color };
  });

  if (cart.lines.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 pb-20 pt-36 text-center">
        <p className="text-slate-400">السلة فارغة… جاري التحويل إلى المتجر</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 md:px-6 md:pt-36">
      <Breadcrumbs items={[{ label: "سلة التسوق", href: "/cart" }, { label: "إتمام الطلب" }]} />

      <h1 className="mt-5 mb-4 text-3xl font-black text-white md:text-4xl">
        إتمام الطلب
      </h1>
      <p className="mb-10 max-w-2xl text-sm leading-7 text-slate-400">
        أدخل بياناتك وبيانات الحساب المطلوبة — جميع البيانات مشفرة وتُستخدم
        لتنفيذ طلبك فقط.
      </p>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          <section className="rounded-3xl glass p-6">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-white">
              <span className="flex size-7 items-center justify-center rounded-lg bg-volt-500/15 text-sm text-volt-300">1</span>
              بيانات العميل
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="الاسم الكامل *" error={errors.name}>
                <Input
                  placeholder="مثال: أحمد محمود"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </Field>
              <Field
                label="رقم الهاتف *"
                hint="رقم مصري يبدأ بـ 01"
                error={errors.phone}
              >
                <Input
                  dir="ltr"
                  inputMode="tel"
                  placeholder="01012345678"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="text-left"
                />
              </Field>
              <Field label="البريد الإلكتروني (اختياري)" error={errors.email}>
                <Input
                  dir="ltr"
                  type="email"
                  placeholder="example@mail.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="text-left"
                />
              </Field>
              <Field label="ملاحظات (اختياري)">
                <Input
                  placeholder="أي تفاصيل إضافية للتنفيذ"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </Field>
            </div>
          </section>

          <section className="rounded-3xl glass p-6">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-white">
              <span className="flex size-7 items-center justify-center rounded-lg bg-volt-500/15 text-sm text-volt-300">2</span>
              طريقة الدفع
            </h2>
            {errors.payment && (
              <p className="mb-3 text-sm font-semibold text-rose-400">{errors.payment}</p>
            )}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {myMethods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`relative flex items-center gap-3 rounded-2xl border p-4 text-start transition-all ${
                    paymentMethod === m.id
                      ? "border-volt-500/50 bg-volt-500/10 shadow-glow"
                      : "border-white/8 bg-white/3 hover:border-white/20"
                  }`}
                >
                  <span
                    className="flex size-11 items-center justify-center rounded-xl text-white"
                    style={{ background: m.color }}
                  >
                    <m.Icon className="size-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-black text-white">{m.name}</span>
                    <span className="block text-[11px] text-slate-500">{m.desc}</span>
                  </span>
                  {paymentMethod === m.id && (
                    <span className="absolute end-3.5 top-3.5 size-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />
                  )}
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/8 p-3.5 text-xs text-slate-400">
              <ShieldCheck className="size-4.5 shrink-0 text-emerald-400" />
              بيئة الدفع بنظام واجهة موحدة (Gateway Abstraction) — جاهزة للربط
              ببوابات حقيقية دون تعديل الواجهات.
            </div>
          </section>

          <section className="flex items-center justify-between rounded-3xl glass p-5">
            <div className="flex items-center gap-3">
              <MessageSquare className="size-5 text-volt-400" />
              <div>
                <p className="text-sm font-black text-white">تواجه مشكلة في الدفع؟</p>
                <p className="text-xs text-slate-500">فريق الدعم جاهز لمساعدتك</p>
              </div>
            </div>
            <Link
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || "201000000000"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-bold text-emerald-300 transition hover:bg-emerald-500/20"
            >
              واتساب
            </Link>
          </section>
        </div>

        <div className="glass-strong h-fit rounded-3xl p-6 lg:sticky lg:top-28">
          <h2 className="text-lg font-black text-white">ملخص الطلب</h2>

          <div className="mt-4 space-y-3 border-b border-white/8 pb-4">
            {summary.map((s) => (
              <div key={s.name} className="flex items-start justify-between gap-3 text-sm">
                <span className="min-w-0">
                  <span className="block truncate font-bold text-slate-200">{s.name}</span>
                  <span className="text-[11px] text-slate-500">الكمية: {s.qty}</span>
                </span>
                <span className="shrink-0 font-black text-white">
                  {formatPrice(s.price)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <TicketPercent className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-slate-600" />
                <Input
                  dir="ltr"
                  className="ps-9 text-left"
                  placeholder="كود الخصم"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-11 px-4"
                onClick={applyCoupon}
                loading={couponLoading}
              >
                تفعيل
              </Button>
            </div>
            {coupon.message && (
              <p className="mt-2 text-xs font-bold text-emerald-400">{coupon.message}</p>
            )}
            {coupon.error && (
              <p className="mt-2 text-xs font-bold text-rose-400">{coupon.error}</p>
            )}
          </div>

          <div className="mt-4 space-y-2.5 border-t border-white/8 pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">الإجمالي الفرعي</span>
              <span className="font-bold text-slate-200">{formatPrice(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between text-emerald-400">
              <span>الخصم</span>
              <span className="font-bold">-{formatPrice(discount)}</span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-base font-black text-white">الإجمالي</span>
              <span className="text-2xl font-black text-gradient">
                {formatPrice(total)}
              </span>
            </div>
          </div>

          <Button
            size="lg"
            className="mt-5 w-full"
            onClick={submit}
            loading={submitting}
            disabled={cart.lines.length === 0}
          >
            {submitting ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                جاري معالجة الدفع…
              </>
            ) : (
              <>
                تأكيد الطلب والدفع
                <ArrowLeft className="size-5" />
              </>
            )}
          </Button>
          <p className="mt-3 text-center text-[11px] leading-5 text-slate-600">
            بالضغط على التأكيد أنت توافق على شروط الاستخدام وطرق التنفيذ.
          </p>
        </div>
      </div>
    </div>
  );
}