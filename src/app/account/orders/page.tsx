"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, ChevronDown, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/primitives";
import { useToast } from "@/store/toast";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/constants";

interface MyOrder {
  id: string;
  number: string;
  status: string;
  payment: { status: string; method: string; reference: string };
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
  items: { productId: string; name: string; image: string; price: number; quantity: number; customData: Record<string, string> }[];
  timeline: { status: string; at: string }[];
  createdAt: string;
  canReview: boolean;
}

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<MyOrder[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const toast = useToast();

  const load = useCallback(() => {
    fetch("/api/account/orders", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setOrders(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const [reviewing, setReviewing] = useState<MyOrder | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [saving, setSaving] = useState(false);

  const submitReview = async () => {
    if (!reviewing) return;
    setSaving(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: reviewing.id, rating, text: reviewText }),
      });
      const d = await res.json();
      if (!res.ok) {
        toast.error("تعذر إرسال التقييم", d.message);
        return;
      }
      toast.success("شكرًا لك! تم إرسال تقييمك للمراجعة");
      setReviewing(null);
      setReviewText("");
      setRating(5);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black text-white md:text-3xl">طلباتي</h1>
        <p className="mt-1.5 text-sm text-slate-400">تابع حالة طلباتك وتتبع مراحل تنفيذها.</p>
      </div>

      {!orders ? (
        <div className="space-y-3">
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-32 rounded-3xl" />
        </div>
      ) : orders.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-white/10 py-16 text-center text-sm text-slate-500">
          لا توجد طلبات بعد — ابدأ التسوق الآن.
        </p>
      ) : (
        orders.map((o) => {
          const expanded = open === o.id;
          return (
            <div key={o.id} className="overflow-hidden rounded-3xl glass">
              <button
                onClick={() => setOpen(expanded ? null : o.id)}
                className="flex w-full flex-wrap items-center gap-4 p-5 text-start transition hover:bg-white/2"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-sm font-black text-white" dir="ltr">{o.number}</span>
                    <span
                      className={cn(
                        "rounded-md px-2 py-0.5 text-[11px] font-black",
                        o.status === "delivered"
                          ? "bg-emerald-500/15 text-emerald-300"
                          : o.status === "cancelled"
                            ? "bg-rose-500/15 text-rose-300"
                            : "bg-volt-500/15 text-volt-300"
                      )}
                    >
                      {ORDER_STATUS_LABELS[o.status as keyof typeof ORDER_STATUS_LABELS] || o.status}
                    </span>
                    <span className="text-[11px] text-slate-500">{formatDate(o.createdAt)}</span>
                  </div>
                  <p className="mt-1 truncate text-sm text-slate-400">
                    {o.items.map((i) => i.name).join("، ")}
                  </p>
                </div>
                <div className="text-end">
                  <p className="text-base font-black text-white">{formatPrice(o.total)}</p>
                  <ChevronDown className={cn("ms-auto size-4 text-slate-500 transition", expanded && "rotate-180")} />
                </div>
              </button>

              {expanded && (
                <div className="border-t border-white/5 p-5">
                  <div className="space-y-3">
                    {o.items.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <img src={it.image} alt="" className="size-12 rounded-xl bg-night-800 object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-white">{it.name}</p>
                          <p className="text-xs text-slate-500">الكمية: {it.quantity}</p>
                          {it.customData && Object.keys(it.customData).length > 0 && (
                            <p className="mt-0.5 truncate text-[11px] text-slate-500" dir="ltr">
                              {Object.entries(it.customData)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(" — ")}
                            </p>
                          )}
                        </div>
                        <p className="text-sm font-bold text-slate-200">{formatPrice(it.price * it.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="text-slate-400">
                      الدفع:{" "}
                      <span className="font-bold text-white">
                        {PAYMENT_STATUS_LABELS[o.payment.status as keyof typeof PAYMENT_STATUS_LABELS] || o.payment.status}
                      </span>
                      {o.payment.reference && (
                        <span className="ms-2 font-mono text-xs text-slate-500" dir="ltr">{o.payment.reference}</span>
                      )}
                    </span>
                    <span className="text-slate-400">
                      المجموع: <span className="font-black text-white">{formatPrice(o.subtotal)}</span>
                      {o.discount > 0 && (
                        <>
                          {" "}
                          <span className="text-rose-400">-{formatPrice(o.discount)}</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="mt-4 rounded-2xl bg-night-900/60 p-4">
                    <p className="mb-3 text-xs font-black text-slate-400">مسار الطلب</p>
                    <div className="space-y-2.5">
                      {o.timeline.map((t, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm">
                          <span className="flex size-6 items-center justify-center rounded-full bg-volt-500/15">
                            <CheckCircle2 className="size-3.5 text-volt-400" />
                          </span>
                          <span className="font-bold text-white">
                            {ORDER_STATUS_LABELS[t.status as keyof typeof ORDER_STATUS_LABELS] || t.status}
                          </span>
                          <span className="text-xs text-slate-500">{formatDate(t.at)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {o.canReview && (
                    <button
                      onClick={() => setReviewing(o)}
                      className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-l from-volt-600 to-glow-600 px-4 py-2.5 text-sm font-bold text-white shadow-glow transition hover:brightness-110"
                    >
                      <Star className="size-4" />
                      قيّم هذا الطلب
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}

      {reviewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={() => setReviewing(null)}>
          <div className="w-full max-w-md rounded-3xl glass p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-black text-white">تقييم طلب {reviewing.number}</h3>
            <div className="mt-4 flex justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setRating(n)} aria-label={`${n} نجوم`}>
                  <Star className={cn("size-8 transition", n <= rating ? "fill-amber-400 text-amber-400" : "text-slate-600")} />
                </button>
              ))}
            </div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="اكتب تجربتك مع المنتج والخدمة..."
              rows={4}
              className="mt-4 w-full rounded-2xl border border-white/10 bg-night-900/70 p-3.5 text-sm text-white placeholder:text-slate-600 focus:border-volt-500/50 focus:outline-none"
            />
            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                onClick={() => setReviewing(null)}
                className="rounded-xl bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-300 hover:bg-white/10"
              >
                إلغاء
              </button>
              <button
                onClick={submitReview}
                disabled={saving || reviewText.trim().length < 3}
                className="rounded-xl bg-gradient-to-l from-volt-600 to-glow-600 px-5 py-2.5 text-sm font-bold text-white shadow-glow transition hover:brightness-110 disabled:opacity-50"
              >
                {saving ? "جارٍ الإرسال..." : "إرسال التقييم"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}