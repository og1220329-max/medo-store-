"use client";

import { useState } from "react";
import { ShieldCheck, UserRound } from "lucide-react";
import { useAdminFetch } from "@/components/admin/use-admin-fetch";
import { useToast } from "@/store/toast";
import { Skeleton } from "@/components/ui/primitives";
import { cn, formatDate } from "@/lib/utils";
import type { RoleInfo } from "@/lib/types";

interface UsersData {
  roles: RoleInfo[];
  users: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    roleId: string | null;
    active: boolean;
    createdAt: string;
    lastLoginAt: string | null;
  }>;
}

const KNOWN_ROLES: Record<string, string> = {
  r_super: "المالك",
  r_admin: "مدير",
  r_manager: "مشرف",
  r_support: "دعم العملاء",
  r_orders: "متابعة الطلبات",
};

export default function AdminUsers() {
  const { data, loading, reload } = useAdminFetch<UsersData>("/api/admin/users");
  const toast = useToast();
  const [busy, setBusy] = useState<string | null>(null);

  const patch = async (id: string, body: Record<string, unknown>, label: string) => {
    setBusy(id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...body }),
      });
      const d = await res.json();
      if (!res.ok) {
        toast.error("تعذر التحديث", d.message);
        return;
      }
      toast.success(label);
      reload();
    } finally {
      setBusy(null);
    }
  };

  const admins = (data?.users || []).filter((u) => u.role === "admin");
  const customers = (data?.users || []).filter((u) => u.role === "customer");

  const roleName = (u: { role: string; roleId: string | null }) =>
    u.roleId ? KNOWN_ROLES[u.roleId] || u.roleId : u.role === "admin" ? "مدير" : "عميل";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white md:text-3xl">المستخدمون والصلاحيات</h1>
        <p className="mt-1.5 text-sm text-slate-400">
          إدارة حسابات الفريق والعملاء — تحديد الأدوار وتفعيل/تعطيل الحسابات.
        </p>
      </div>

      {loading || !data ? (
        <div className="space-y-3">
          <Skeleton className="h-28 rounded-3xl" />
          <Skeleton className="h-28 rounded-3xl" />
        </div>
      ) : (
        <>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-black text-slate-300">
            <ShieldCheck className="size-4 text-volt-400" />
            فريق الإدارة ({admins.length.toLocaleString("ar-EG")})
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {admins.map((u) => (
              <div key={u.id} className="rounded-2xl glass p-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-volt-500/10 text-volt-400">
                    <UserRound className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-white">{u.name}</p>
                    <p className="truncate text-xs text-slate-500" dir="ltr">{u.email}</p>
                  </div>
                  <span className="rounded-md bg-volt-500/15 px-2 py-0.5 text-[11px] font-black text-volt-300">
                    {roleName(u)}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {data.roles.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => patch(u.id, { roleId: r.id, role: "admin" }, "تم نقل الصلاحية")}
                      disabled={busy === u.id}
                      className={cn(
                        "rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition disabled:opacity-50",
                        u.roleId === r.id
                          ? "bg-volt-500/20 text-volt-200"
                          : "bg-white/5 text-slate-400 hover:bg-white/10"
                      )}
                    >
                      {r.name}
                    </button>
                  ))}
                  <button
                    onClick={() => patch(u.id, { role: "customer", roleId: null }, "أصبح عميلًا")}
                    disabled={busy === u.id}
                    className="rounded-lg bg-rose-500/10 px-2.5 py-1.5 text-[11px] font-bold text-rose-300 hover:bg-rose-500/20 disabled:opacity-50"
                  >
                    إزالة صلاحية الأدمن
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h2 className="mb-3 mt-8 flex items-center gap-2 text-sm font-black text-slate-300">
            <UserRound className="size-4 text-sky-400" />
            العملاء ({customers.length.toLocaleString("ar-EG")})
          </h2>
          <div className="overflow-x-auto rounded-3xl glass">
            <table className="w-full min-w-130 text-sm">
              <thead>
                <tr className="border-b border-white/8 text-start text-xs text-slate-500">
                  <th className="p-4 text-start font-bold">العميل</th>
                  <th className="p-4 text-start font-bold">تاريخ التسجيل</th>
                  <th className="p-4 text-start font-bold">الحالة</th>
                  <th className="p-4 text-start font-bold">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((u) => (
                  <tr key={u.id} className="border-b border-white/5 last:border-0">
                    <td className="p-4">
                      <p className="font-bold text-white">{u.name}</p>
                      <p className="truncate text-xs text-slate-500" dir="ltr">{u.email}</p>
                    </td>
                    <td className="p-4 text-slate-400">{formatDate(u.createdAt)}</td>
                    <td className="p-4">
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-[11px] font-black",
                          u.active ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"
                        )}
                      >
                        {u.active ? "نشط" : "موقوف"}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => patch(u.id, { active: !u.active }, u.active ? "تم إيقاف الحساب" : "تم تفعيل الحساب")}
                        disabled={busy === u.id}
                        className={cn(
                          "rounded-lg px-3 py-1.5 text-[11px] font-bold transition disabled:opacity-50",
                          u.active
                            ? "bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
                            : "bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                        )}
                      >
                        {u.active ? "إيقاف" : "تفعيل"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}