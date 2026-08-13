"use client";

import { useState } from "react";
import { Pencil, Plus, Tag, Trash2 } from "lucide-react";
import { useAdminFetch } from "@/components/admin/use-admin-fetch";
import { useToast } from "@/store/toast";
import { Badge, Button, Field, Input, Select, Skeleton } from "@/components/ui/primitives";
import { Modal } from "@/components/ui/modal";
import { formatDate } from "@/lib/utils";
import type { Coupon } from "@/lib/types";

export default function AdminCoupons() {
  const { data, loading, reload } = useAdminFetch<Coupon[]>("/api/admin/coupons");
  const toast = useToast();
  const [editing, setEditing] = useState<Coupon | null | "new">(null);
  const [saving, setSaving] = useState(false);

  const save = async (payload: Record<string, unknown>) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: payload.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const d = await res.json();
      if (!res.ok) {
        toast.error("تعذر الحفظ", d.message);
        return;
      }
      toast.success(payload.id ? "تم تحديث الكوبون" : "تم إنشاء الكوبون");
      setEditing(null);
      reload();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (c: Coupon) => {
    if (!confirm(`حذف كوبون ${c.code}؟`)) return;
    const res = await fetch(`/api/admin/coupons?id=${c.id}`, { method: "DELETE" });
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
          <h1 className="text-2xl font-black text-white md:text-3xl">كوبونات الخصم</h1>
          <p className="mt-1.5 text-sm text-slate-400">
            قسم نسبة أو مبلغًا ثابتًا على الطلبات — مع حدود الاستخدام والصلاحية.
          </p>
        </div>
        <Button onClick={() => setEditing("new")}>
          <Plus className="size-4.5" />
          كوبون جديد
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : (data || []).length === 0 ? (
        <p className="rounded-3xl border border-dashed border-white/10 py-16 text-center text-sm text-slate-500">
          لا توجد كوبونات
        </p>
      ) : (
        <div className="space-y-3">
          {(data || []).map((c) => {
            const expired = c.expiresAt && new Date(c.expiresAt).getTime() < Date.now();
            const exhausted = c.used >= c.maxUses;
            return (
              <div key={c.id} className="flex flex-wrap items-center gap-4 rounded-2xl glass p-4">
                <Tag className="size-5 text-volt-400" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg border border-volt-500/30 bg-volt-500/10 px-2.5 py-1 font-mono text-sm font-black text-white" dir="ltr">
                      {c.code}
                    </span>
                    {c.type === "percent" ? (
                      <Badge tone="emerald">خصم {c.value}%</Badge>
                    ) : (
                      <Badge tone="emerald">خصم {c.value} ج.م</Badge>
                    )}
                    {c.minOrder ? <Badge tone="sky">أقل طلب {c.minOrder} ج.م</Badge> : null}
                    {!c.active || expired || exhausted ? (
                      <Badge tone="rose">معطل</Badge>
                    ) : (
                      <Badge tone="emerald">مفعل</Badge>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500">
                    الاستخدام: {c.used.toLocaleString("ar-EG")} / {c.maxUses.toLocaleString("ar-EG")}
                    {c.expiresAt && <> — ينتهي: {formatDate(c.expiresAt)}</>}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setEditing(c)}
                    aria-label="تعديل"
                    className="flex size-9 items-center justify-center rounded-lg bg-white/5 text-slate-300 hover:text-white"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    onClick={() => remove(c)}
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

      <CouponFormModal
        open={editing !== null}
        coupon={editing === "new" ? null : editing}
        saving={saving}
        onClose={() => setEditing(null)}
        onSave={save}
      />
    </div>
  );
}

function CouponFormModal({
  open,
  coupon,
  saving,
  onClose,
  onSave,
}: {
  open: boolean;
  coupon: Coupon | null;
  saving: boolean;
  onClose: () => void;
  onSave: (p: Record<string, unknown>) => void;
}) {
  const [form, setForm] = useState<Record<string, unknown>>({});

  if (open && Object.keys(form).length === 0 && coupon) {
    setForm({
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrder: coupon.minOrder || "",
      maxUses: coupon.maxUses,
      expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : "",
      active: coupon.active,
    });
  }
  if (open && Object.keys(form).length === 0 && !coupon) {
    setForm({
      code: "",
      type: "percent",
      value: 10,
      minOrder: "",
      maxUses: 100,
      expiresAt: "",
      active: true,
    });
  }

  const close = () => {
    setForm({});
    onClose();
  };

  return (
    <Modal open={open} onClose={close} labelledBy="coupon-title">
      <div className="p-6">
        <h3 id="coupon-title" className="text-lg font-black text-white">
          {coupon ? `تعديل ${coupon.code}` : "كوبون جديد"}
        </h3>

        <div className="mt-5 space-y-4">
          <Field label="الكود *">
            <Input
              dir="ltr"
              className="text-left font-mono uppercase"
              value={(form.code as string) || ""}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="SAVE10"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="النوع">
              <Select
                value={(form.type as string) || "percent"}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="percent" className="bg-night-800">نسبة %</option>
                <option value="fixed" className="bg-night-800">مبلغ ثابت (ج.م)</option>
              </Select>
            </Field>
            <Field label={form.type === "percent" ? "نسبة الخصم %" : "المبلغ (ج.م)"}>
              <Input
                dir="ltr"
                type="number"
                className="text-left"
                value={form.value as number}
                onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
              />
            </Field>
            <Field label="أقل قيمة طلب (اختياري)">
              <Input
                dir="ltr"
                type="number"
                className="text-left"
                value={form.minOrder as number}
                onChange={(e) =>
                  setForm({ ...form, minOrder: e.target.value === "" ? "" : Number(e.target.value) })
                }
              />
            </Field>
            <Field label="حد الاستخدام">
              <Input
                dir="ltr"
                type="number"
                className="text-left"
                value={form.maxUses as number}
                onChange={(e) => setForm({ ...form, maxUses: Number(e.target.value) })}
              />
            </Field>
            <Field label="تاريخ الانتهاء">
              <Input
                dir="ltr"
                type="date"
                className="text-left"
                value={(form.expiresAt as string) || ""}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
              />
            </Field>
            <label className="flex items-end gap-2 pb-2.5 text-sm font-bold text-slate-300">
              <input
                type="checkbox"
                checked={Boolean(form.active)}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="size-4 accent-volt-500"
              />
              مفعل
            </label>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            size="lg"
            className="flex-1"
            loading={saving}
            onClick={() =>
              onSave({
                ...form,
                minOrder: form.minOrder === "" ? null : form.minOrder,
                expiresAt: form.expiresAt
                  ? new Date(form.expiresAt as string).toISOString()
                  : null,
              })
            }
          >
            {coupon ? "حفظ" : "إنشاء"}
          </Button>
          <Button size="lg" variant="ghost" onClick={close}>
            إلغاء
          </Button>
        </div>
      </div>
    </Modal>
  );
}