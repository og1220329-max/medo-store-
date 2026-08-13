"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, PackageSearch, Truck } from "lucide-react";
import {
  ORDER_STATUS_FLOW,
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/lib/constants";
import { formatDate, formatPrice } from "@/lib/utils";
import { Button, Field, Input, EmptyState } from "@/components/ui/primitives";

interface TrackedOrder {
  number: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  total: number;
  paymentStatus: string;
  paymentMethod: string;
  items: Array<{ name: string; quantity: number; price: number; image?: string }>;
  timeline: Array<{ status: string; at: string }>;
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="pt-40" />}>
      <TrackForm />
    </Suspense>
  );
}

function TrackForm() {
  const searchParams = useSearchParams();
  const [number, setNumber] = useState(searchParams.get("order") || "");
  const [phone, setPhone] = useState(searchParams.get("phone") || "");
  const [result, setResult] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const track = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!number.trim() || !phone.trim()) {
      setError("أدخل رقم الطلب ورقم الهاتف");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "لم يتم العثور على الطلب");
        return;
      }
      setResult(data.order);
    } catch {
      setError("حدث خطأ في الاتصال");
    } finally {
      setLoading(false);
    }
  };

  const currentIndex = result
    ? ORDER_STATUS_FLOW.indexOf(result.status as (typeof ORDER_STATUS_FLOW)[number])
    : -1;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-32 md:pt-40">
      <div className="text-center">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-volt-500/30 bg-volt-500/10 px-4 py-1.5 text-xs font-bold text-volt-300">
          <Truck className="size-4" />
          تتبع فوري لحظيًا
        </span>
        <h1 className="text-3xl font-black text-white md:text-4xl">تتبع طلبك</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-400">
          أدخل رقم الطلب ورقم الهاتف المسجلين عند إتمام الطلب لمتابعة مراحل
          التنفيذ.
        </p>
      </div>

      <form
        onSubmit={track}
        className="mt-10 flex flex-col gap-4 rounded-3xl glass-strong p-6 sm:flex-row sm:items-end"
      >
        <Field label="رقم الطلب *" className="flex-1">
          <Input
            dir="ltr"
            placeholder="MS-123456"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="text-left font-mono"
          />
        </Field>
        <Field label="رقم الهاتف *" className="flex-1">
          <Input
            dir="ltr"
            placeholder="01012345678"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="text-left"
          />
        </Field>
        <Button size="md" loading={loading} className="sm:h-11">
          تتبع الطلب
        </Button>
      </form>

      {error && (
        <div className="mt-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-center text-sm font-bold text-rose-300">
          {error}
        </div>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl glass p-5">
            <div>
              <p className="text-xs text-slate-500">رقم الطلب</p>
              <p className="mt-1 font-mono text-lg font-black text-white" dir="ltr">
                {result.number}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">تاريخ الإنشاء</p>
              <p className="mt-1 text-sm font-bold text-slate-300">
                {formatDate(result.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">حالة الدفع</p>
              <p className="mt-1 text-sm font-black text-emerald-400">
                {PAYMENT_STATUS_LABELS[result.paymentStatus as keyof typeof PAYMENT_STATUS_LABELS] || result.paymentStatus}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">الإجمالي</p>
              <p className="mt-1 text-lg font-black text-gradient">
                {formatPrice(result.total)}
              </p>
            </div>
          </div>

          <div className="rounded-3xl glass p-6 md:p-8">
            <h2 className="mb-8 text-center text-lg font-black text-white">
              مراحل تنفيذ الطلب
            </h2>
            <ol className="relative">
              <span className="absolute inset-y-1 end-[21px] w-0.5 bg-white/8 md:start-1/2 md:-translate-x-1/2" />
              {ORDER_STATUS_FLOW.map((status, i) => {
                const reached = currentIndex >= i;
                const isCurrent = currentIndex === i;
                const timelineEntry = result.timeline.find((t) => t.status === status);
                return (
                  <li key={status} className="relative mb-7 last:mb-0 md:grid md:grid-cols-2 md:gap-8">
                    <div
                      className={`flex items-start gap-4 ${
                        i % 2 === 0 ? "md:justify-end md:text-end" : ""
                      }`}
                    >
                      <div className="min-w-0 flex-1 md:max-w-md">
                        <p
                          className={`flex items-center gap-1.5 text-sm font-black ${
                            reached ? "text-white" : "text-slate-600"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <span className="hidden">•</span>
                          {ORDER_STATUS_LABELS[status]}
                        </p>
                        {timelineEntry ? (
                          <p className="mt-1 text-xs text-slate-500">
                            {formatDate(timelineEntry.at)}
                          </p>
                        ) : (
                          <p className="mt-1 text-xs text-slate-700">
                            غير مكتمل بعد
                          </p>
                        )}
                      </div>
                      <span className="relative z-10 mt-0.5 flex flex-col items-center">
                        {isCurrent ? (
                          <motion.span
                            animate={{ scale: [1, 1.25, 1] }}
                            transition={{ repeat: Infinity, duration: 1.6 }}
                            className="flex size-9 items-center justify-center rounded-full bg-volt-500 text-white shadow-glow"
                          >
                            <Truck className="size-4.5" />
                          </motion.span>
                        ) : reached ? (
                          <span className="flex size-9 items-center justify-center rounded-full bg-emerald-500 text-white">
                            <CheckCircle2 className="size-4.5" />
                          </span>
                        ) : (
                          <span className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-night-800 text-slate-600">
                            <Circle className="size-4" />
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="hidden md:block" />
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="rounded-3xl glass p-5">
            <h3 className="mb-3 text-sm font-black text-white">منتجات الطلب</h3>
            <div className="space-y-2">
              {result.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
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

          <div className="text-center">
            <Button variant="outline" onClick={() => setResult(null)}>
              تتبع طلب آخر
            </Button>
          </div>
        </motion.div>
      )}

      {!result && !error && (
        <div className="mt-14">
          <EmptyState
            icon={<PackageSearch className="size-7" />}
            title="لم تجد طلبك بعد؟"
            description="تأكد من إدخال رقم الطلب الصحيح ورقم الهاتف المستخدم في الطلب، أو تواصل مع الدعم."
            action={
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || "201000000000"}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline">تواصل مع الدعم</Button>
              </a>
            }
          />
        </div>
      )}
    </div>
  );
}