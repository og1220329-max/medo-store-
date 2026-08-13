"use client";

import { useState } from "react";
import { Image as ImageIcon, Pencil, Plus, Trash2 } from "lucide-react";
import { useAdminFetch } from "@/components/admin/use-admin-fetch";
import { useToast } from "@/store/toast";
import { Button, Field, Input, Skeleton } from "@/components/ui/primitives";
import { Modal } from "@/components/ui/modal";
import { formatDate } from "@/lib/utils";
import type { Banner } from "@/lib/types";

const IMG_OPTIONS = [
  "/images/uc-660.svg",
  "/images/uc-3850.svg",
  "/images/uc-8100.svg",
  "/images/uc-kr.svg",
  "/images/royale-pass.svg",
  "/images/social-instagram.svg",
  "/images/gift-card.svg",
];

export default function AdminBanners() {
  const { data, loading, reload } = useAdminFetch<Banner[]>("/api/admin/banners");
  const toast = useToast();
  const [editing, setEditing] = useState<Banner | null | "new">(null);
  const [saving, setSaving] = useState(false);

  const save = async (payload: Record<string, unknown>) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/banners", {
        method: payload.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const d = await res.json();
      if (!res.ok) {
        toast.error("تعذر الحفظ", d.message);
        return;
      }
      toast.success(payload.id ? "تم تحديث البانر" : "تم إنشاء البانر");
      setEditing(null);
      reload();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (b: Banner) => {
    if (!confirm(`حذف البانر "${b.title}"؟`)) return;
    const res = await fetch(`/api/admin/banners?id=${b.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("تعذر الحذف");
      return;
    }
    toast.success("تم الحذف");
    reload();
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white md:text-3xl">البنرات</h1>
          <p className="mt-1.5 text-sm text-slate-400">
            البنرات الدوارة أعلى الصفحة الرئيسية — تحكم بالعرض والترتيب.
          </p>
        </div>
        <Button onClick={() => setEditing("new")}>
          <Plus className="size-4.5" />
          بانر جديد
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : (data || []).length === 0 ? (
        <p className="rounded-3xl border border-dashed border-white/10 py-16 text-center text-sm text-slate-500">
          لا توجد بنرات — أضف أول بانر ليشاهد عملاؤك.
        </p>
      ) : (
        <div className="space-y-3">
          {(data || []).map((b) => (
            <div key={b.id} className="flex flex-wrap items-center gap-4 rounded-2xl glass p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.image} alt="" className="size-16 rounded-xl bg-night-800 object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-black text-white">{b.title}</p>
                  {b.active ? (
                    <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-black text-emerald-300">مفعل</span>
                  ) : (
                    <span className="rounded-md bg-rose-500/15 px-2 py-0.5 text-[11px] font-black text-rose-300">معطل</span>
                  )}
                </div>
                {b.subtitle && <p className="mt-0.5 truncate text-xs text-slate-500">{b.subtitle}</p>}
                <p className="mt-1 text-[11px] text-slate-600">
                  الترتيب {b.order} — {b.endsAt ? `ينتهي ${formatDate(b.endsAt)}` : "بدون انتهاء"}
                </p>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setEditing(b)}
                  aria-label="تعديل"
                  className="flex size-9 items-center justify-center rounded-lg bg-white/5 text-slate-300 hover:text-white"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  onClick={() => remove(b)}
                  aria-label="حذف"
                  className="flex size-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <BannerModal
          open={editing !== null}
          banner={editing === "new" ? null : editing}
          saving={saving}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
    </div>
  );
}

function BannerModal({
  open,
  banner,
  saving,
  onClose,
  onSave,
}: {
  open: boolean;
  banner: Banner | null;
  saving: boolean;
  onClose: () => void;
  onSave: (payload: Record<string, unknown>) => void;
}) {
  const [form, setForm] = useState({
    title: banner?.title || "",
    subtitle: banner?.subtitle || "",
    image: banner?.image || IMG_OPTIONS[0],
    buttonText: banner?.buttonText || "",
    buttonUrl: banner?.buttonUrl || "",
    endsAt: banner?.endsAt || "",
    order: banner ? String(banner.order) : "0",
    active: banner?.active ?? true,
  });

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="text-lg font-black text-white">{banner ? "تعديل البانر" : "بانر جديد"}</h3>
      <div className="mt-5 space-y-4">
        <Field label="العنوان *">
          <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="مثال: خصم 40% على شدات ببجي" />
        </Field>
        <Field label="الوصف المختصر">
          <Input value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} placeholder="سطر إضافي يظهر تحت العنوان" />
        </Field>
        <Field label="الصورة">
          <div className="grid grid-cols-4 gap-2">
            {IMG_OPTIONS.map((src) => (
              <button
                key={src}
                onClick={() => set("image", src)}
                className={`overflow-hidden rounded-xl border-2 transition ${form.image === src ? "border-volt-500" : "border-white/10"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="aspect-square w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <ImageIcon className="size-4" />
            {form.image}
          </div>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="نص الزر">
            <Input value={form.buttonText} onChange={(e) => set("buttonText", e.target.value)} placeholder="اشترِ الآن" />
          </Field>
          <Field label="رابط الزر">
            <Input value={form.buttonUrl} onChange={(e) => set("buttonUrl", e.target.value)} placeholder="/products" dir="ltr" />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="ينتهي في">
            <Input type="datetime-local" value={form.endsAt ? form.endsAt.slice(0, 16) : ""} onChange={(e) => set("endsAt", e.target.value ? new Date(e.target.value).toISOString() : "")} />
          </Field>
          <Field label="الترتيب">
            <Input type="number" value={form.order} onChange={(e) => set("order", e.target.value)} />
          </Field>
        </div>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm font-bold text-white">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => set("active", e.target.checked)}
            className="size-4 accent-volt-500"
          />
          بانر مفعل
        </label>
        <div className="flex items-center justify-between gap-3 pt-2">
          <button onClick={onClose} className="rounded-xl bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-300 hover:bg-white/10">
            إلغاء
          </button>
          <Button
            onClick={() =>
              onSave({
                ...form,
                id: banner?.id,
                endsAt: form.endsAt || undefined,
                order: Number(form.order),
              })
            }
            disabled={saving || !form.title.trim()}
          >
            {saving ? "جارٍ الحفظ..." : "حفظ"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}