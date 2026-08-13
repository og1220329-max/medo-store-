"use client";

import { useState } from "react";
import { Pencil, Plus, Tag, Trash2 } from "lucide-react";
import { useAdminFetch } from "@/components/admin/use-admin-fetch";
import { useToast } from "@/store/toast";
import { Button, Field, Input, Skeleton } from "@/components/ui/primitives";
import { Modal } from "@/components/ui/modal";
import { formatDate } from "@/lib/utils";
import type { Offer, Product } from "@/lib/types";

export default function AdminOffers() {
  const { data: offers, loading, reload } = useAdminFetch<Offer[]>("/api/admin/offers");
  const { data: products } = useAdminFetch<Product[]>("/api/admin/products-list");
  const toast = useToast();
  const [editing, setEditing] = useState<Offer | null | "new">(null);
  const [saving, setSaving] = useState(false);

  const save = async (payload: Record<string, unknown>) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/offers", {
        method: payload.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const d = await res.json();
      if (!res.ok) {
        toast.error("تعذر الحفظ", d.message);
        return;
      }
      toast.success(payload.id ? "تم تحديث العرض" : "تم إنشاء العرض");
      setEditing(null);
      reload();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (o: Offer) => {
    if (!confirm(`حذف العرض "${o.title}"؟`)) return;
    const res = await fetch(`/api/admin/offers?id=${o.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("تعذر الحذف");
      return;
    }
    toast.success("تم الحذف");
    reload();
  };

  const now = Date.now();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white md:text-3xl">العروض</h1>
          <p className="mt-1.5 text-sm text-slate-400">
            عروض خاصة تظهر في قسم العروض وفي أقسام المنتجات المرتبطة.
          </p>
        </div>
        <Button onClick={() => setEditing("new")}>
          <Plus className="size-4.5" />
          عرض جديد
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : (offers || []).length === 0 ? (
        <p className="rounded-3xl border border-dashed border-white/10 py-16 text-center text-sm text-slate-500">
          لا توجد عروض — أضف أول عرض الآن.
        </p>
      ) : (
        <div className="space-y-3">
          {(offers || []).map((o) => {
            const expired = o.endsAt && new Date(o.endsAt).getTime() < now;
            return (
              <div key={o.id} className="flex flex-wrap items-center gap-4 rounded-2xl glass p-4">
                <span className="flex size-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
                  <Tag className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-black text-white">{o.title}</p>
                    {o.discountPct ? (
                      <span className="rounded-md bg-rose-500/15 px-2 py-0.5 text-[11px] font-black text-rose-300">
                        خصم {o.discountPct}%
                      </span>
                    ) : null}
                    {o.active && !expired ? (
                      <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-black text-emerald-300">مفعل</span>
                    ) : (
                      <span className="rounded-md bg-rose-500/15 px-2 py-0.5 text-[11px] font-black text-rose-300">معطل</span>
                    )}
                  </div>
                  {o.description && <p className="mt-0.5 truncate text-xs text-slate-500">{o.description}</p>}
                  <p className="mt-1 text-[11px] text-slate-600">
                    {o.productIds.length} منتج — {o.endsAt ? `ينتهي ${formatDate(o.endsAt)}` : "بدون انتهاء"}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setEditing(o)}
                    aria-label="تعديل"
                    className="flex size-9 items-center justify-center rounded-lg bg-white/5 text-slate-300 hover:text-white"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    onClick={() => remove(o)}
                    aria-label="حذف"
                    className="flex size-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <OfferModal
          open={editing !== null}
          offer={editing === "new" ? null : editing}
          products={products || []}
          saving={saving}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
    </div>
  );
}

function OfferModal({
  open,
  offer,
  products,
  saving,
  onClose,
  onSave,
}: {
  open: boolean;
  offer: Offer | null;
  products: Product[];
  saving: boolean;
  onClose: () => void;
  onSave: (payload: Record<string, unknown>) => void;
}) {
  const [form, setForm] = useState({
    title: offer?.title || "",
    description: offer?.description || "",
    badge: offer?.badge || "",
    discountPct: offer?.discountPct != null ? String(offer.discountPct) : "",
    productIds: offer?.productIds || [],
    endsAt: offer?.endsAt || "",
    order: offer ? String(offer.order) : "0",
    active: offer?.active ?? true,
  });

  const toggleProduct = (id: string) => {
    setForm((f) => ({
      ...f,
      productIds: f.productIds.includes(id)
        ? f.productIds.filter((x) => x !== id)
        : [...f.productIds, id],
    }));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="text-lg font-black text-white">{offer ? "تعديل العرض" : "عرض جديد"}</h3>
      <div className="mt-5 space-y-4">
        <Field label="عنوان العرض *">
          <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="مثال: فلاش سيل شدات UC" />
        </Field>
        <Field label="الوصف">
          <Input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="شارة العرض">
            <Input value={form.badge} onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))} placeholder="فلاش سيل" />
          </Field>
          <Field label="نسبة الخصم %">
            <Input type="number" value={form.discountPct} onChange={(e) => setForm((f) => ({ ...f, discountPct: e.target.value }))} />
          </Field>
          <Field label="الترتيب">
            <Input type="number" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))} />
          </Field>
        </div>
        <Field label="ينتهي في">
          <Input
            type="datetime-local"
            value={form.endsAt ? form.endsAt.slice(0, 16) : ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                endsAt: e.target.value ? new Date(e.target.value).toISOString() : "",
              }))
            }
          />
        </Field>
        <Field label="المنتجات المشمولة">
          <div className="max-h-48 space-y-1.5 overflow-y-auto rounded-2xl border border-white/10 p-3">
            {products.map((p) => (
              <label key={p.id} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-slate-300 hover:bg-white/5">
                <input
                  type="checkbox"
                  checked={form.productIds.includes(p.id)}
                  onChange={() => toggleProduct(p.id)}
                  className="size-4 accent-volt-500"
                />
                {p.name}
              </label>
            ))}
          </div>
        </Field>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm font-bold text-white">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
            className="size-4 accent-volt-500"
          />
          عرض مفعل
        </label>
        <div className="flex items-center justify-between gap-3 pt-2">
          <button onClick={onClose} className="rounded-xl bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-300 hover:bg-white/10">
            إلغاء
          </button>
          <Button
            onClick={() =>
              onSave({
                ...form,
                id: offer?.id,
                discountPct: form.discountPct ? Number(form.discountPct) : undefined,
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