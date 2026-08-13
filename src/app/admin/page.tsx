"use client";

import Link from "next/link";
import {
  ArrowDownRight,
  Banknote,
  CircleDollarSign,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";
import { useAdminFetch } from "@/components/admin/use-admin-fetch";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { Skeleton } from "@/components/ui/primitives";
import { formatPrice } from "@/lib/utils";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/lib/constants";

interface Overview {
  totals: {
    orders: number;
    revenue: number;
    pending: number;
    processing: number;
    completed: number;
    customers: number;
    products: number;
  };
  chart: Array<{ label: string; revenue: number; orders: number }>;
  byStatus: Record<string, number>;
  recentOrders: Array<{
    number: string;
    status: string;
    paymentStatus: string;
    total: number;
    customer: string;
    createdAt: string;
  }>;
}

export default function AdminDashboard() {
  const { data, loading } = useAdminFetch<Overview>("/api/admin/overview");

  const stats = data
    ? [
        { icon: CircleDollarSign, label: "إجمالي المبيعات", value: formatPrice(data.totals.revenue), color: "text-emerald-400 bg-emerald-500/10" },
        { icon: ShoppingBag, label: "إجمالي الطلبات", value: data.totals.orders.toLocaleString("ar-EG"), color: "text-volt-400 bg-volt-500/10" },
        { icon: Banknote, label: "طلبات قيد التنفيذ", value: data.totals.processing.toLocaleString("ar-EG"), color: "text-amber-400 bg-amber-500/10" },
        { icon: Package, label: "طلبات مكتملة", value: data.totals.completed.toLocaleString("ar-EG"), color: "text-sky-400 bg-sky-500/10" },
        { icon: Users, label: "العملاء", value: data.totals.customers.toLocaleString("ar-EG"), color: "text-fuchsia-400 bg-fuchsia-500/10" },
      ]
    : [];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white md:text-3xl">
            لوحة التحكم
          </h1>
          <p className="mt-1.5 text-sm text-slate-400">
            نظرة شاملة على مبيعاتك وطلباتك وعملاءك.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="rounded-xl bg-gradient-to-l from-volt-600 to-glow-600 px-5 py-2.5 text-sm font-bold text-white shadow-glow transition hover:brightness-110"
        >
          + منتج جديد
        </Link>
      </div>

      {loading || !data ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-3xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-3xl glass p-5">
                <span className={`mb-4 flex size-11 items-center justify-center rounded-xl ${s.color}`}>
                  <s.icon className="size-5" />
                </span>
                <p className="text-2xl font-black text-white">{s.value}</p>
                <p className="mt-1 text-xs text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-3xl glass p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-base font-black text-white">مبيعات آخر 7 أيام</h2>
                <span className="text-xs text-slate-500">
                  إجمالي:{" "}
                  <span className="font-black text-emerald-400">
                    {formatPrice(data.chart.reduce((a, d) => a + d.revenue, 0))}
                  </span>
                </span>
              </div>
              <RevenueChart days={data.chart} />
            </div>

            <div className="rounded-3xl glass p-6">
              <h2 className="mb-4 text-base font-black text-white">
                توزيع حالات الطلبات
              </h2>
              <div className="space-y-3">
                {Object.entries(data.byStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">
                      {ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS] || status}
                    </span>
                    <span className="font-black text-white">
                      {count.toLocaleString("ar-EG")}
                    </span>
                  </div>
                ))}
                {Object.keys(data.byStatus).length === 0 && (
                  <p className="py-6 text-center text-sm text-slate-500">
                    لا توجد طلبات بعد
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl glass p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-black text-white">أحدث الطلبات</h2>
              <Link href="/admin/orders" className="flex items-center gap-1 text-xs font-bold text-volt-400 hover:text-volt-300">
                عرض الكل
                <ArrowDownRight className="size-3.5" />
              </Link>
            </div>
            {data.recentOrders.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">
                لا توجد طلبات بعد — ستظهر هنا أول طلبات متجرك.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-130 text-sm">
                  <thead>
                    <tr className="border-b border-white/8 text-start text-xs text-slate-500">
                      <th className="pb-3 text-start font-bold">الطلب</th>
                      <th className="pb-3 text-start font-bold">العميل</th>
                      <th className="pb-3 text-start font-bold">الحالة</th>
                      <th className="pb-3 text-start font-bold">الدفع</th>
                      <th className="pb-3 text-start font-bold">الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentOrders.map((o) => (
                      <tr key={o.number} className="border-b border-white/5 last:border-0">
                        <td className="py-3 font-mono text-xs font-bold text-white" dir="ltr">
                          {o.number}
                        </td>
                        <td className="py-3 text-slate-300">{o.customer}</td>
                        <td className="py-3 text-slate-300">
                          {ORDER_STATUS_LABELS[o.status as keyof typeof ORDER_STATUS_LABELS] || o.status}
                        </td>
                        <td className="py-3">
                          <span className="text-xs font-bold text-emerald-400">
                            {PAYMENT_STATUS_LABELS[o.paymentStatus as keyof typeof PAYMENT_STATUS_LABELS] || o.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 font-black text-slate-200">
                          {formatPrice(o.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}