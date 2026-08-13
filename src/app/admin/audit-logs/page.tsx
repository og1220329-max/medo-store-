"use client";

import { History } from "lucide-react";
import { useAdminFetch } from "@/components/admin/use-admin-fetch";
import { Skeleton } from "@/components/ui/primitives";
import { formatDate } from "@/lib/utils";
import type { AuditLog } from "@/lib/types";

const ACTION_LABELS: Record<string, string> = {
  create: "إنشاء",
  update: "تعديل",
  delete: "حذف",
  advance: "تحديث حالة",
  login: "دخول",
  toggle: "تبديل",
};

export default function AdminAuditLogs() {
  const { data, loading } = useAdminFetch<AuditLog[]>("/api/admin/audit-logs");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white md:text-3xl">سجل العمليات</h1>
        <p className="mt-1.5 text-sm text-slate-400">
          سجل تفصيلي بكل الإجراءات التي قام بها فريق الإدارة.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 rounded-3xl" />
          <Skeleton className="h-24 rounded-3xl" />
        </div>
      ) : (data || []).length === 0 ? (
        <p className="rounded-3xl border border-dashed border-white/10 py-16 text-center text-sm text-slate-500">
          لا توجد عمليات مسجلة بعد.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-3xl glass">
          <table className="w-full min-w-160 text-sm">
            <thead>
              <tr className="border-b border-white/8 text-start text-xs text-slate-500">
                <th className="p-4 text-start font-bold">الوقت</th>
                <th className="p-4 text-start font-bold">الفريق</th>
                <th className="p-4 text-start font-bold">الإجراء</th>
                <th className="p-4 text-start font-bold">الهدف</th>
                <th className="p-4 text-start font-bold">التفاصيل</th>
              </tr>
            </thead>
            <tbody>
              {(data || []).map((log) => (
                <tr key={log.id} className="border-b border-white/5 last:border-0">
                  <td className="whitespace-nowrap p-4 text-xs text-slate-400">{formatDate(log.createdAt)}</td>
                  <td className="p-4 font-bold text-white">{log.adminName}</td>
                  <td className="p-4">
                    <span className="rounded-md bg-volt-500/10 px-2 py-0.5 text-[11px] font-black text-volt-300">
                      {ACTION_LABELS[log.action] || log.action}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">
                    {log.entity}
                    {log.entityId && (
                      <span className="ms-1.5 font-mono text-[11px] text-slate-500" dir="ltr">{log.entityId}</span>
                    )}
                  </td>
                  <td className="max-w-72 truncate p-4 text-xs text-slate-500">
                    {log.details ? JSON.stringify(log.details) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-600">
        <History className="size-3" />
        يحتفظ النظام بآخر 1000 عملية.
      </p>
    </div>
  );
}