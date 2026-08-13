"use client";

import { Mail, MessageSquare } from "lucide-react";
import { useAdminFetch } from "@/components/admin/use-admin-fetch";
import { useToast } from "@/store/toast";
import { Badge, Skeleton } from "@/components/ui/primitives";
import { formatDate } from "@/lib/utils";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMessages() {
  const { data, loading, reload } = useAdminFetch<Message[]>("/api/admin/messages");
  const toast = useToast();

  const unread = (data || []).filter((m) => !m.read).length;

  const toggleRead = async (m: Message) => {
    await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: m.id, read: !m.read }),
    });
    reload();
  };

  const reply = (m: Message) => {
    toast.info("تم فتح رد عبر البريد", m.email);
    window.location.href = `mailto:${m.email}?subject=رد: ${m.subject}`;
  };

  return (
    <div>
      <h1 className="mb-2 text-2xl font-black text-white md:text-3xl">رسائل الدعم</h1>
      <p className="mb-6 text-sm text-slate-400">
        {unread > 0 ? (
          <span className="font-black text-amber-400">{unread} رسالة غير مقروءة</span>
        ) : (
          "لا توجد رسائل غير مقروءة"
        )}
      </p>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : (data || []).length === 0 ? (
        <p className="rounded-3xl border border-dashed border-white/10 py-16 text-center text-sm text-slate-500">
          لا توجد رسائل حتى الآن — ستظهر هنا رسائل عملاء صفحة تواصل معنا.
        </p>
      ) : (
        <div className="space-y-3">
          {(data || []).map((m) => (
            <div
              key={m.id}
              className={`rounded-2xl glass p-5 ${!m.read ? "border-volt-500/30 bg-volt-500/5" : ""}`}
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-volt-500/15 text-volt-300">
                  <MessageSquare className="size-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-white">{m.subject}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {m.name} — <span dir="ltr">{m.email}</span> — {formatDate(m.createdAt)}
                  </p>
                </div>
                {!m.read ? <Badge tone="amber">جديد</Badge> : <Badge>مودع</Badge>}
              </div>
              <p className="mt-3 rounded-xl bg-white/4 p-3.5 text-sm leading-7 text-slate-300">
                {m.message}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => reply(m)}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400 transition hover:bg-emerald-500/20"
                >
                  <Mail className="size-3.5" />
                  الرد بالبريد
                </button>
                <button
                  onClick={() => toggleRead(m)}
                  className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-300 transition hover:bg-white/10"
                >
                  {m.read ? "تحديد كغير مقروء" : "تحديد كمقروءة"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}