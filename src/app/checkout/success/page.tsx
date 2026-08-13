"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  MessageCircle,
  PackageCheck,
  Sparkles,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/constants";
import { Button, Skeleton } from "@/components/ui/primitives";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") || "";
  const phone = searchParams.get("phone") || "";
  const [order, setOrder] = useState<{
    number: string;
    total: number;
    status: string;
    paymentStatus: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    timeline: Array<{ status: string; at: string }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber || !phone) {
      setLoading(false);
      return;
    }
    fetch("/api/orders/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number: orderNumber, phone }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setOrder(data?.order ?? null))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderNumber, phone]);

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-32 md:pt-40">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", damping: 22 }}
        className="overflow-hidden rounded-[2.5rem] glass-strong"
      >
        <div className="relative border-b border-white/8 bg-gradient-to-l from-volt-600/20 via-transparent to-glow-600/20 px-6 py-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", damping: 14 }}
            className="mx-auto mb-5 flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-[0_0_40px_rgba(52,211,153,0.4)]"
          >
            <CheckCircle2 className="size-10 text-white" />
          </motion.div>
          <h1 className="text-2xl font-black text-white md:text-3xl">
            تم استلام طلبك بنجاح 🎉
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {loading
              ? "جاري تحميل تفاصيل الطلب…"
              : order
              ? "شكرًا لثقتك — سنبدأ التنفيذ فورًا."
              : "تم استلام الطلب، واستخدم رقم الهاتف لتتبع الطلب."}
          </p>
        </div>

        <div className="p-6 md:p-8">
          {order ? (
            <>
              <div className="grid grid-cols-2 gap-3 text-center md:grid-cols-4">
                <div className="rounded-2xl glass p-4">
                  <p className="text-[11px] text-slate-500">رقم الطلب</p>
                  <p className="mt-1 font-mono text-sm font-black text-white" dir="ltr">
                    {order.number}
                  </p>
                </div>
                <div className="rounded-2xl glass p-4">
                  <p className="text-[11px] text-slate-500">حالة الطلب</p>
                  <p className="mt-1 text-sm font-black text-volt-300">
                    {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] || order.status}
                  </p>
                </div>
                <div className="rounded-2xl glass p-4">
                  <p className="text-[11px] text-slate-500">حالة الدفع</p>
                  <p className="mt-1 text-sm font-black text-emerald-400">
                    {PAYMENT_STATUS_LABELS[order.paymentStatus as keyof typeof PAYMENT_STATUS_LABELS] || order.paymentStatus}
                  </p>
                </div>
                <div className="rounded-2xl glass p-4">
                  <p className="text-[11px] text-slate-500">الإجمالي</p>
                  <p className="mt-1 text-sm font-black text-gradient">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/8 bg-white/3 p-4">
                <p className="mb-3 text-sm font-black text-white">تفاصيل الطلب</p>
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-slate-300">
                        {item.name}{" "}
                        <span className="text-slate-600">× {item.quantity}</span>
                      </span>
                      <span className="font-bold text-slate-200">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-center">
              <PackageCheck className="size-10 text-volt-400" />
              <p className="text-sm text-slate-400">
                استخدم رقم الطلب <span className="font-black text-white" dir="ltr">{orderNumber}</span>{" "}
                ورقم هاتفك لتتبع طلبك.
              </p>
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/8 p-4 text-sm">
            <div className="flex items-center gap-2.5">
              <Clock className="size-5 shrink-0 text-emerald-400" />
              <p className="text-slate-300">
                <span className="font-black text-white">مدة التنفيذ المتوقعة:</span>{" "}
                من دقائق حتى ساعتين للطلبات الرقمية
              </p>
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <Link href={`/orders/track?order=${encodeURIComponent(orderNumber)}&phone=${encodeURIComponent(phone)}`}>
              <Button variant="outline" size="lg" className="w-full">
                تتبع الطلب الآن
              </Button>
            </Link>
            <Link
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || "201000000000"}?text=${encodeURIComponent(
                `مرحبًا، لدي استفسار عن طلبي رقم ${orderNumber}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="w-full">
                <MessageCircle className="size-5" />
                تواصل مع الدعم
              </Button>
            </Link>
          </div>

          <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-slate-500">
            <Sparkles className="size-3.5 text-volt-400" />
            احفظ رقم الطلب لمتابعة التنفيذ خطوة بخطوة
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl px-4 pb-24 pt-32 md:pt-40">
          <Skeleton className="h-[480px] rounded-[2.5rem]" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}