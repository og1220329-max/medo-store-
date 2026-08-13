"use client";

import { useCallback, useEffect, useState } from "react";
import { LifeBuoy, Send } from "lucide-react";
import { useAdminFetch } from "@/components/admin/use-admin-fetch";
import { useToast } from "@/store/toast";
import { Skeleton } from "@/components/ui/primitives";
import { cn, formatDate } from "@/lib/utils";
import type { Ticket } from "@/lib/types";

const STATUS_LABELS: Record<string, string> = {
  open: "مفتوحة",
  in_progress: "قيد المعالجة",
  waiting: "بانتظار العميل",
  resolved: "تم الحل",
  closed: "مغلقة",
};

const STATUSES = ["open", "in_progress", "waiting", "resolved", "closed"];

export default function AdminSupportPage() {
  const { data, loading, reload } = useAdminFetch<Ticket[]>("/api/admin/tickets");
  const toast = useToast();
  const [selected, setSelected] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const active = (data || []).find((t) => t.id === selected) || null;

  useEffect(() => {
    if ((data || []).length > 0 && !selected) setSelected(data![0].id);
  }, [data, selected]);

  const send = useCallback(
    async (ticket: Ticket, status?: string) => {
      setSending(true);
      try {
        const res = await fetch("/api/admin/tickets", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: ticket.id, message: reply, status }),
        });
        const d = await res.json();
        if (!res.ok) {
          toast.error("تعذر الحفظ", d.message);
          return;
        }
        toast.success("تم تحديث التذكرة");
        setReply("");
        reload();
      } finally {
        setSending(false);
      }
    },
    [reply, reload, toast]
  );

  const openCount = (data || []).filter((t) => t.status === "open" || t.status === "in_progress").length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white md:text-3xl">دعم العملاء</h1>
        <p className="mt-1.5 text-sm text-slate-400">
          تذاكر الدعم من العملاء — {openCount.toLocaleString("ar-EG")} مفتوحة حاليًا.
        </p>
      </div>

      {loading ? (
        <Skeleton className="h-64 rounded-3xl" />
      ) : (data || []).length === 0 ? (
        <p className="rounded-3xl border border-dashed border-white/10 py-16 text-center text-sm text-slate-500">
          لا توجد تذاكر بعد.
        </p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,22rem)_1fr]">
          <div className="space-y-2">
            {(data || []).map((t) => (
              <button
                key={t.id}
                onClick={() => setSelected(t.id)}
                className={cn(
                  "w-full rounded-2xl border p-4 text-start transition",
                  selected === t.id
                    ? "border-volt-500/30 bg-volt-500/10"
                    : "border-white/5 bg-white/2 hover:border-white/10"
                )}
              >
                <div className="flex items-center gap-2">
                  <LifeBuoy className="size-4 shrink-0 text-volt-400" />
                  <span className="font-mono text-[11px] font-black text-slate-400" dir="ltr">{t.number}</span>
                  <span
                    className={cn(
                      "ms-auto rounded-md px-2 py-0.5 text-[10px] font-black",
                      t.status === "resolved" || t.status === "closed"
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-amber-500/15 text-amber-300"
                    )}
                  >
                    {STATUS_LABELS[t.status] || t.status}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm font-bold text-white">{t.subject}</p>
                <p className="mt-1 text-[11px] text-slate-500">
                  {t.name} — {formatDate(t.updatedAt)}
                </p>
              </button>
            ))}
          </div>

          {active && (
            <div className="rounded-3xl glass p-5">
              <div className="flex flex-wrap items-center gap-3 border-b border-white/5 pb-4">
                <div className="min-w-0 flex-1">
                  <h2 className="font-black text-white">{active.subject}</h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {active.name} {active.email ? `— ${active.email}` : ""} {active.phone ? `— ${active.phone}` : ""}
                    {active.orderNumber ? ` — طلب ${active.orderNumber}` : ""}
                  </p>
                </div>
                <select
                  value={active.status}
                  onChange={(e) => send(active, e.target.value)}
                  disabled={sending}
                  className="rounded-lg border border-white/10 bg-night-900/70 px-3 py-2 text-xs font-bold text-white focus:outline-none"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3 py-4">
                {active.messages.map((m) => (
                  <div key={m.id} className={cn("flex", m.fromAdmin ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                        m.fromAdmin
                          ? "bg-gradient-to-l from-volt-600/80 to-glow-600/80 text-white"
                          : "bg-white/5 text-slate-200"
                      )}
                    >
                      <p className="mb-1 text-[10px] font-black text-slate-400">
                        {m.fromAdmin ? "فريق الدعم" : active.name} — {formatDate(m.createdAt)}
                      </p>
                      <p className="whitespace-pre-wrap">{m.message}</p>
                    </div>
                  </div>
                ))}
                {active.messages.length === 0 && (
                  <p className="py-4 text-center text-sm text-slate-500">لا توجد رسائل</p>
                )}
              </div>

              <div className="flex gap-2 border-t border-white/5 pt-4">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="اكتب ردًا للعميل..."
                  rows={2}
                  className="flex-1 rounded-xl border border-white/10 bg-night-900/70 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-volt-500/50 focus:outline-none"
                />
                <button
                  onClick={() => send(active)}
                  disabled={sending || !reply.trim()}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-l from-volt-600 to-glow-600 px-4 text-sm font-bold text-white shadow-glow transition hover:brightness-110 disabled:opacity-50"
                >
                  <Send className="size-4" />
                  إرسال
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}