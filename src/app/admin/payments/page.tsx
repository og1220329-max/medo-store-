"use client";

import { useState } from "react";
import { Banknote } from "lucide-react";
import { useAdminFetch } from "@/components/admin/use-admin-fetch";
import { useToast } from "@/store/toast";
import { Skeleton } from "@/components/ui/primitives";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import { PAYMENT_STATUS_LABELS } from "@/lib/constants";

interface PaymentsData {
  payments: Array<{
    id: string;
    orderId: string;
    orderNumber: string;
    method: string;
    status: string;
    amount: number;
    reference?: string;
    createdAt: string;
    paidAt?: string;
  }>;
  methods: Record<string, { name: string; icon?: string }>;
  enabled: string[];
}

export default function AdminPayments() {
  const { data, loading, reload } = useAdminFetch<PaymentsData>("/api/admin/payments");
  const toast = useToast();
  const [busy, setBusy] = useState<string | null>(null);

  const toggle = async (method: string, enabled: boolean) => {
    setBusy(method);
    try {
      const res = await fetch("/api/admin/payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, enabled }),
      });
      const d = await res.json();
      if (!res.ok) {
        toast.error("تعذر التحديث", d.message);
        return;
      }
      toast.success(enabled ? "تم تفعيل الوسيلة" : "تم تعطيل الوسيلة");
      reload();
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white md:text-3xl">المدفوعات</h1>
        <p className="mt-1.5 text-sm text-slate-400">
          تفعيل وسائل الدفع المتاحة ومتابعة عمليات الدفع.
        </p>
      </div>

      {loading || !data ? (
        <div className="space-y-3">
          <Skeleton className="h-20 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(data.methods).map(([id, m]) => {
              const enabled = data.enabled.includes(id);
              return (
                <div key={id} className="flex items-center gap-3 rounded-2xl glass p-4">
                  <Banknote className="size-5 text-volt-400" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-white">{m.name}</p>
                    <p className="text-[11px] text-slate-500" dir="ltr">{id}</p>
                  </div>
                  <button
                    onClick={() => toggle(id, !enabled)}
                    disabled={busy === id}
                    role="switch"
                    aria-checked={enabled}
                    className={cn(
                      "relative h-7 w-12 shrink-0 rounded-full transition",
                      enabled ? "bg-volt-500" : "bg-white/10",
                      busy === id && "opacity-50"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-1 size-5 rounded-full bg-white transition-all",
                        enabled ? "start-6" : "start-1"
                      )}
                    />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-6 overflow-x-auto rounded-3xl glass">
            <table className="w-full min-w-150 text-sm">
              <thead>
                <tr className="border-b border-white/8 text-start text-xs text-slate-500">
                  <th className="p-4 text-start font-bold">الطلب</th>
                  <th className="p-4 text-start font-bold">الوسيلة</th>
                  <th className="p-4 text-start font-bold">الحالة</th>
                  <th className="p-4 text-start font-bold">المبلغ</th>
                  <th className="p-4 text-start font-bold">المرجع</th>
                  <th className="p-4 text-start font-bold">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {(data.payments || []).map((p) => (
                  <tr key={p.id} className="border-b border-white/5 last:border-0">
                    <td className="p-4 font-mono text-xs font-black text-white" dir="ltr">
                      {p.orderNumber}
                    </td>
                    <td className="p-4 text-slate-300">{data.methods[p.method]?.name || p.method}</td>
                    <td className="p-4">
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-[11px] font-black",
                          p.status === "paid"
                            ? "bg-emerald-500/15 text-emerald-300"
                            : p.status === "failed"
                              ? "bg-rose-500/15 text-rose-300"
                              : "bg-amber-500/15 text-amber-300"
                        )}
                      >
                        {PAYMENT_STATUS_LABELS[p.status as keyof typeof PAYMENT_STATUS_LABELS] || p.status}
                      </span>
                    </td>
                    <td className="p-4 font-black text-white">{formatPrice(p.amount)}</td>
                    <td className="p-4 font-mono text-xs text-slate-500" dir="ltr">
                      {p.reference || "—"}
                    </td>
                    <td className="whitespace-nowrap p-4 text-xs text-slate-400">
                      {formatDate(p.paidAt || p.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(data.payments || []).length === 0 && (
              <p className="py-10 text-center text-sm text-slate-500">لا توجد مدفوعات بعد</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}