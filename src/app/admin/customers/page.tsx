"use client";

import { useAdminFetch } from "@/components/admin/use-admin-fetch";
import { Skeleton } from "@/components/ui/primitives";
import { formatDate, formatPrice } from "@/lib/utils";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  lastLoginAt: string | null;
  ordersCount: number;
  totalSpent: number;
}

export default function AdminCustomers() {
  const { data, loading } = useAdminFetch<Customer[]>("/api/admin/customers");

  const sorted = (data || []).slice().sort((a, b) => b.totalSpent - a.totalSpent);
  const totalSpent = sorted.reduce((s, c) => s + c.totalSpent, 0);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-black text-white md:text-3xl">العملاء</h1>
      <p className="mb-6 text-sm text-slate-400">
        {sorted.length} عميل — إجمالي مشترياتهم:{" "}
        <span className="font-black text-emerald-400">{formatPrice(totalSpent)}</span>
      </p>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-2xl" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-white/10 py-16 text-center text-sm text-slate-500">
          لا يوجد عملاء مسجلون بعد
        </p>
      ) : (
        <div className="overflow-x-auto rounded-3xl glass">
          <table className="w-full min-w-160 text-sm">
            <thead>
              <tr className="border-b border-white/8 text-xs text-slate-500">
                <th className="p-4 text-start font-bold">العميل</th>
                <th className="p-4 text-start font-bold">الهاتف</th>
                <th className="p-4 text-start font-bold">تاريخ التسجيل</th>
                <th className="p-4 text-start font-bold">آخر دخول</th>
                <th className="p-4 text-start font-bold">الطلبات</th>
                <th className="p-4 text-start font-bold">إجمالي المشتريات</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((c) => (
                <tr key={c.id} className="border-b border-white/5 last:border-0 hover:bg-white/3">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-volt-500 to-glow-500 text-xs font-black text-white">
                        {c.name.charAt(0)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-black text-white">{c.name}</p>
                        <p className="truncate text-[11px] text-slate-500" dir="ltr">
                          {c.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-300" dir="ltr">{c.phone || "—"}</td>
                  <td className="p-4 text-xs text-slate-400">{formatDate(c.createdAt)}</td>
                  <td className="p-4 text-xs text-slate-400">
                    {c.lastLoginAt ? formatDate(c.lastLoginAt) : "—"}
                  </td>
                  <td className="p-4 font-black text-slate-200">
                    {c.ordersCount.toLocaleString("ar-EG")}
                  </td>
                  <td className="p-4 font-black text-gradient">
                    {formatPrice(c.totalSpent)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}