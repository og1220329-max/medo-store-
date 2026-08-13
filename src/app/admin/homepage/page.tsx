"use client";

import { useState } from "react";
import { LayoutTemplate, Save } from "lucide-react";
import { useAdminFetch } from "@/components/admin/use-admin-fetch";
import { useToast } from "@/store/toast";
import { Skeleton } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import type { HomepageSection } from "@/lib/types";

export default function AdminHomepage() {
  const { data, loading, reload } = useAdminFetch<HomepageSection[]>("/api/admin/homepage");
  const toast = useToast();
  const [sections, setSections] = useState<HomepageSection[] | null>(null);
  const [saving, setSaving] = useState(false);

  if (!sections && data) setSections(data);

  const toggle = (key: string) => {
    setSections((s) => s!.map((h) => (h.key === key ? { ...h, enabled: !h.enabled } : h)));
  };

  const setTitle = (key: string, title: string) => {
    setSections((s) => s!.map((h) => (h.key === key ? { ...h, title } : h)));
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/homepage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sections: sections!.map((h) => ({ key: h.key, enabled: h.enabled, title: h.title })),
        }),
      });
      const d = await res.json();
      if (!res.ok) {
        toast.error("تعذر الحفظ", d.message);
        return;
      }
      toast.success("تم حفظ ترتيب الصفحة الرئيسية");
      reload();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white md:text-3xl">مصمم الصفحة الرئيسية</h1>
          <p className="mt-1.5 text-sm text-slate-400">
            فعّل أو عطّل أقسام الصفحة الرئيسية وعدّل عناوينها — التغييرات تظهر فورًا.
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving || !sections}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-l from-volt-600 to-glow-600 px-5 py-2.5 text-sm font-bold text-white shadow-glow transition hover:brightness-110 disabled:opacity-50"
        >
          <Save className="size-4" />
          {saving ? "جارٍ الحفظ..." : "حفظ التغييرات"}
        </button>
      </div>

      {!sections ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {[...sections]
            .sort((a, b) => a.order - b.order)
            .map((h) => (
              <div
                key={h.key}
                className={cn(
                  "flex flex-wrap items-center gap-4 rounded-2xl glass p-4 transition",
                  !h.enabled && "opacity-55"
                )}
              >
                <button
                  onClick={() => toggle(h.key)}
                  role="switch"
                  aria-checked={h.enabled}
                  className={cn(
                    "relative h-7 w-12 shrink-0 rounded-full transition",
                    h.enabled ? "bg-volt-500" : "bg-white/10"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-1 size-5 rounded-full bg-white transition-all",
                      h.enabled ? "start-6" : "start-1"
                    )}
                  />
                </button>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-volt-500/10 text-volt-400">
                  <LayoutTemplate className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-black text-white">{h.name}</p>
                  {h.title && (
                    <input
                      value={h.title}
                      onChange={(e) => setTitle(h.key, e.target.value)}
                      className="mt-1 w-full max-w-sm rounded-lg border border-white/10 bg-night-900/70 px-3 py-1.5 text-xs text-slate-300 focus:border-volt-500/50 focus:outline-none"
                      placeholder="عنوان القسم"
                    />
                  )}
                </div>
                <span className="text-xs text-slate-500">الترتيب {h.order}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}