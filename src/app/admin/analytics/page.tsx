"use client";

import { useState } from "react";
import { Banknote, CheckCircle2, TrendingUp, XCircle } from "lucide-react";
import { useAdminFetch } from "@/components/admin/use-admin-fetch";
import { Skeleton } from "@/components/ui/primitives";
import { formatPrice } from "@/lib/utils";

interface Analytics {
  totals: {
    revenue: number;
    orders: number;
    paidOrders: number;
    avgOrder: number;
    pendingPayments: number;
    cancelled: number;
  };
  byMethod: Record<string, number>;
  methodLabels: Record<string, { name: string }>;
  topProducts: Array<{ name: string; total: number; count: number; image: string }>;
  byCategory: Array<{ name: string; total: number; count: number }>;
}

export default function AdminAnalytics() {
  const { data, loading } = useAdminFetch<Analytics>("/api/admin/analytics");

  if (loading || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-3xl" />
        ))}
      </div>
    );
  }

  const maxCat = Math.max(1, ...data.byCategory.map((c) => c.total));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white md:text-3xl">التحليلات</h1>
        <p className="mt-1.5 text-sm text-slate-400">
          نظرة معمقة على المبيعات والمنتجات الأكثر ربحًا.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl glass p-5">
          <TrendingUp className="mb-3 size-5 text-emerald-400" />
          <p className="text-2xl font-black text-white">{formatPrice(data.totals.revenue)}</p>
          <p className="mt-1 text-xs text-slate-500">إجمالي الإيرادات</p>
        </div>
        <div className="rounded-3xl glass p-5">
          <Banknote className="mb-3 size-5 text-volt-400" />
          <p className="text-2xl font-black text-white">{data.totals.paidOrders.toLocaleString("ar-EG")}</p>
          <p className="mt-1 text-xs text-slate-500">طلبات مدفوعة</p>
        </div>
        <div className="rounded-3xl glass p-5">
          <svg className="mb-3 size-5 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <p className="text-2xl font-black text-white">{formatPrice(data.totals.avgOrder)}</p>
          <p className="mt-1 text-xs text-slate-500">متوسط قيمة الطلب</p>
        </div>
        <div className="rounded-3xl glass p-5">
          <XCircle className="mb-3 size-5 text-amber-400" />
          <p className="text-2xl font-black text-white">{data.totals.pendingPayments.toLocaleString("ar-EG")}</p>
          <p className="mt-1 text-xs text-slate-500">مدفوعات معلقة</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl glass p-6">
          <h2 className="mb-5 text-base font-black text-white">المبيعات حسب الفئة</h2>
          <div className="space-y-4">
            {data.byCategory.map((c) => (
              <div key={c.name}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{c.name}</span>
                  <span className="text-slate-400">{formatPrice(c.total)}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-volt-500 to-glow-500"
                    style={{ width: `${Math.max(4, (c.total / maxCat) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
            {data.byCategory.length === 0 && (
              <p className="py-6 text-center text-sm text-slate-500">لا توجد بيانات بعد</p>
            )}
          </div>
        </div>

        <div className="rounded-3xl glass p-6">
          <h2 className="mb-5 text-base font-black text-white">وسائل الدفع الأكثر استخدامًا</h2>
          <div className="space-y-3">
            {Object.entries(data.byMethod).map(([method, total]) => (
              <div key={method} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/2 p-3.5">
                <span className="text-sm font-bold text-white">
                  {data.methodLabels[method]?.name || method}
                </span>
                <span className="text-sm font-black text-emerald-400">{formatPrice(total)}</span>
              </div>
            ))}
            {Object.keys(data.byMethod).length === 0 && (
              <p className="py-6 text-center text-sm text-slate-500">لا توجد مدفوعات بعد</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl glass p-6">
        <h2 className="mb-5 flex items-center gap-2 text-base font-black text-white">
          <CheckCircle2 className="size-4 text-volt-400" />
          الأعلى مبيعًا
        </h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {data.topProducts.map((p, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/2 p-3.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt="" className="size-12 rounded-xl bg-night-800 object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">{p.name}</p>
                <p className="text-xs text-slate-500">
                  {p.count.toLocaleString("ar-EG")} وحدة — {formatPrice(p.total)}
                </p>
              </div>
              <span className="text-lg font-black text-slate-600">#{i + 1}</span>
            </div>
          ))}
          {data.topProducts.length === 0 && (
            <p className="col-span-full py-6 text-center text-sm text-slate-500">لا توجد مبيعات بعد</p>
          )}
        </div>
      </div>
    </div>
  );
}