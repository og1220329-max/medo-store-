"use client";

import { useEffect, useState } from "react";
import { LifeBuoy, Plus, Send } from "lucide-react";
import { Skeleton } from "@/components/ui/primitives";
import { useToast } from "@/store/toast";
import { cn, formatDate } from "@/lib/utils";

interface MyTicket {
  id: string;
  number: string;
  subject: string;
  status: string;
  orderNumber?: string;
  messages: { id: string; fromAdmin: boolean; message: string; createdAt: string }[];
  createdAt: string;
  updatedAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  open: "مفتوحة",
  in_progress: "قيد المعالجة",
  waiting: "بانتظار ردك",
  resolved: "تم الحل",
  closed: "مغلقة",
};

export default function AccountTicketsPage() {
  const [tickets, setTickets] = useState<MyTicket[] | null>(null);
  const toast = useToast();
  const [composing, setComposing] = useState(false);
  const [subject, setSubject] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch("/api/account/tickets", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setTickets(d))
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/account/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, orderNumber, message: body }),
      });
      const d = await res.json();
      if (!res.ok) {
        toast.error("تعذر إرسال التذكرة", d.message);
        return;
      }
      toast.success(`تم إنشاء التذكرة ${d.ticket?.number || ""}`);
      setComposing(false);
      setSubject("");
      setOrderNumber("");
      setBody("");
      load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white md:text-3xl">تذاكر الدعم</h1>
          <p className="mt-1.5 text-sm text-slate-400">
            تواصل مع فريق الدعم لمشاكل الطلبات والاستفسارات.
          </p>
        </div>
        <button
          onClick={() => setComposing((v) => !v)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-l from-volt-600 to-glow-600 px-4 py-2.5 text-sm font-bold text-white shadow-glow transition hover:brightness-110"
        >
          <Plus className="size-4" />
          تذكرة جديدة
        </button>
      </div>

      {composing && (
        <div className="rounded-3xl glass p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="موضوع التذكرة (مثال: تأخر تنفيذ طلب)"
              className="rounded-xl border border-white/10 bg-night-900/70 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-volt-500/50 focus:outline-none"
            />
            <input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="رقم الطلب (اختياري)"
              className="rounded-xl border border-white/10 bg-night-900/70 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-volt-500/50 focus:outline-none"
              dir="ltr"
            />
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="اشرح مشكلتك بالتفصيل..."
            rows={4}
            className="mt-4 w-full rounded-xl border border-white/10 bg-night-900/70 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-volt-500/50 focus:outline-none"
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={create}
              disabled={saving || subject.trim().length < 3 || body.trim().length < 5}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-l from-volt-600 to-glow-600 px-5 py-2.5 text-sm font-bold text-white shadow-glow transition hover:brightness-110 disabled:opacity-50"
            >
              <Send className="size-4" />
              {saving ? "جارٍ الإرسال..." : "إرسال التذكرة"}
            </button>
          </div>
        </div>
      )}

      {!tickets ? (
        <div className="space-y-3">
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-32 rounded-3xl" />
        </div>
      ) : tickets.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-white/10 py-16 text-center text-sm text-slate-500">
          لا توجد تذاكر — أنشئ تذكرة وسيرد عليك فريق الدعم.
        </p>
      ) : (
        tickets.map((t) => (
          <div key={t.id} className="rounded-3xl glass p-5">
            <div className="flex flex-wrap items-center gap-3">
              <LifeBuoy className="size-5 text-volt-400" />
              <span className="font-mono text-xs font-black text-white" dir="ltr">{t.number}</span>
              <span
                className={cn(
                  "rounded-md px-2 py-0.5 text-[11px] font-black",
                  t.status === "resolved" || t.status === "closed"
                    ? "bg-emerald-500/15 text-emerald-300"
                    : "bg-amber-500/15 text-amber-300"
                )}
              >
                {STATUS_LABELS[t.status] || t.status}
              </span>
              {t.orderNumber && (
                <span className="font-mono text-[11px] text-slate-500" dir="ltr">{t.orderNumber}</span>
              )}
              <span className="ms-auto text-[11px] text-slate-500">{formatDate(t.updatedAt)}</span>
            </div>
            <h3 className="mt-3 font-black text-white">{t.subject}</h3>
            <div className="mt-4 space-y-3">
              {t.messages.map((m) => (
                <div key={m.id} className={cn("flex", m.fromAdmin ? "justify-start" : "justify-end")}>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                      m.fromAdmin
                        ? "bg-white/5 text-slate-200"
                        : "bg-gradient-to-l from-volt-600/80 to-glow-600/80 text-white"
                    )}
                  >
                    <p className="mb-1 text-[10px] font-black text-slate-400">
                      {m.fromAdmin ? "فريق الدعم" : "أنت"} — {formatDate(m.createdAt)}
                    </p>
                    <p className="whitespace-pre-wrap">{m.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}