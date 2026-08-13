"use client";

import { useState } from "react";
import { Check, FileText, Star, Trash2 } from "lucide-react";
import { useAdminFetch } from "@/components/admin/use-admin-fetch";
import { useToast } from "@/store/toast";
import { Skeleton } from "@/components/ui/primitives";
import { cn, formatDate } from "@/lib/utils";
import type { Review } from "@/lib/types";

export default function AdminReviews() {
  const { data, loading, reload } = useAdminFetch<Review[]>("/api/admin/reviews");
  const toast = useToast();
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const patch = async (id: string, body: Record<string, unknown>) => {
    const res = await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...body }),
    });
    const d = await res.json();
    if (!res.ok) {
      toast.error("تعذر التحديث", d.message);
      return;
    }
    toast.success("تم تحديث التقييم");
    reload();
  };

  const remove = async (r: Review) => {
    if (!confirm("حذف هذا التقييم؟")) return;
    await fetch(`/api/admin/reviews?id=${r.id}`, { method: "DELETE" });
    toast.success("تم الحذف");
    reload();
  };

  const list = (data || []).filter((r) => {
    if (filter === "pending") return !r.approved;
    if (filter === "approved") return r.approved;
    return true;
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white md:text-3xl">تقييمات العملاء</h1>
          <p className="mt-1.5 text-sm text-slate-400">
            اعتمد التقييمات الجديدة قبل ظهورها في المتجر واختر المميز منها.
          </p>
        </div>
        <div className="flex gap-2">
          {(
            [
              ["all", "الكل"],
              ["pending", "بانتظار الاعتماد"],
              ["approved", "معتمدة"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                "rounded-lg px-3.5 py-2 text-xs font-bold transition",
                filter === key ? "bg-volt-500/15 text-white" : "text-slate-400 hover:bg-white/5"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-white/10 py-16 text-center text-sm text-slate-500">
          لا توجد تقييمات في هذا التصنيف.
        </p>
      ) : (
        <div className="space-y-3">
          {list.map((r) => (
            <div key={r.id} className={cn("rounded-2xl glass p-4", !r.approved && "border-amber-500/20")}>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex grow gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className={cn("size-4", n <= r.rating ? "fill-amber-400 text-amber-400" : "text-slate-700")} />
                  ))}
                </div>
                <p className="text-sm font-black text-white">{r.name}</p>
                <span className="text-[11px] text-slate-500">{formatDate(r.date)}</span>
                {r.product && <span className="text-[11px] text-slate-500">— {r.product}</span>}
                <div className="ms-auto flex items-center gap-1.5">
                  {!r.approved && (
                    <button
                      onClick={() => patch(r.id, { approved: true })}
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20"
                    >
                      <Check className="size-3.5" />
                      اعتماد
                    </button>
                  )}
                  {r.approved && (
                    <button
                      onClick={() => patch(r.id, { featured: !r.featured })}
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition",
                        r.featured
                          ? "bg-volt-500/15 text-volt-300"
                          : "bg-white/5 text-slate-400 hover:bg-white/10"
                      )}
                    >
                      <Star className="size-3.5" />
                      {r.featured ? "أساسي" : "مميز"}
                    </button>
                  )}
                  <button
                    onClick={() => remove(r)}
                    className="flex items-center gap-1.5 rounded-lg bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/20"
                  >
                    <Trash2 className="size-3.5" />
                    حذف
                  </button>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{r.text}</p>
              {r.verified && (
                <p className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                  <FileText className="size-3" />
                  عميل موثق بطلب فعلًا
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}