"use client";

import { useEffect, useState } from "react";
import { Save, Store } from "lucide-react";
import { useToast } from "@/store/toast";
import { Button, Field, Input, Textarea } from "@/components/ui/primitives";
import { Skeleton } from "@/components/ui/primitives";
import { PAYMENT_METHODS } from "@/lib/constants";

const METHOD_COLORS: Record<string, string> = {
  fawry: "#fb7185",
  vodafone: "#f43f5e",
  instapay: "#a78bfa",
  bank: "#38bdf8",
  card: "#22d3ee",
};

export default function AdminSettings() {
  const toast = useToast();
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        setForm({ ...d });
        setPaymentMethods(d.paymentMethods || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, paymentMethods }),
      });
      const d = await res.json();
      if (!res.ok) {
        toast.error("تعذر الحفظ", d.message);
        return;
      }
      toast.success("تم حفظ الإعدادات");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-3xl" />
        ))}
      </div>
    );
  }

  const set = (key: string, value: unknown) => setForm({ ...form, [key]: value });

  return (
    <div className="max-w-4xl">
      <h1 className="mb-6 text-2xl font-black text-white md:text-3xl">الإعدادات</h1>

      <div className="space-y-8">
        <section className="rounded-3xl glass p-6">
          <h2 className="mb-5 flex items-center gap-2 text-base font-black text-white">
            <Store className="size-5 text-volt-400" />
            بيانات المتجر
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="اسم المتجر">
              <Input value={(form.storeName as string) || ""} onChange={(e) => set("storeName", e.target.value)} />
            </Field>
            <Field label="الشعار النصي">
              <Input value={(form.tagline as string) || ""} onChange={(e) => set("tagline", e.target.value)} />
            </Field>
            <Field label="العملة">
              <Input dir="ltr" className="text-left" value={(form.currency as string) || ""} onChange={(e) => set("currency", e.target.value)} />
            </Field>
            <Field label="العنوان">
              <Input value={(form.address as string) || ""} onChange={(e) => set("address", e.target.value)} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="الإعلان في أعلى الصفحة">
                <Input value={(form.announcement as string) || ""} onChange={(e) => set("announcement", e.target.value)} />
              </Field>
            </div>
          </div>
        </section>

        <section className="rounded-3xl glass p-6">
          <h2 className="mb-5 text-base font-black text-white">التواصل والسوشيال</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="البريد الإلكتروني">
              <Input dir="ltr" className="text-left" value={(form.email as string) || ""} onChange={(e) => set("email", e.target.value)} />
            </Field>
            <Field label="رقم الهاتف">
              <Input dir="ltr" className="text-left" value={(form.phone as string) || ""} onChange={(e) => set("phone", e.target.value)} />
            </Field>
            <Field label="واتساب">
              <Input dir="ltr" className="text-left" value={(form.whatsapp as string) || ""} onChange={(e) => set("whatsapp", e.target.value)} />
            </Field>
            <Field label="تيليجرام">
              <Input dir="ltr" className="text-left" value={(form.telegram as string) || ""} onChange={(e) => set("telegram", e.target.value)} />
            </Field>
            <Field label="فيسبوك">
              <Input dir="ltr" className="text-left" value={(form.facebook as string) || ""} onChange={(e) => set("facebook", e.target.value)} />
            </Field>
            <Field label="إنستجرام">
              <Input dir="ltr" className="text-left" value={(form.instagram as string) || ""} onChange={(e) => set("instagram", e.target.value)} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="ملاحظة التوصيل / التنفيذ">
                <Textarea value={(form.deliveryNote as string) || ""} onChange={(e) => set("deliveryNote", e.target.value)} />
              </Field>
            </div>
          </div>
        </section>

        <section className="rounded-3xl glass p-6">
          <h2 className="mb-1.5 text-base font-black text-white">طرق الدفع</h2>
          <p className="mb-5 text-xs text-slate-500">
            فعّل أو عطّل طرق الدفع المعروضة في صفحة إتمام الطلب.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.values(PAYMENT_METHODS).map((m) => {
              const checked = paymentMethods.includes(m.id);
              return (
                <button
                  key={m.id}
                  onClick={() =>
                    setPaymentMethods((prev) =>
                      checked
                        ? prev.filter((p) => p !== m.id)
                        : [...prev, m.id]
                    )
                  }
                  className={`flex items-center gap-3 rounded-2xl border p-4 text-start transition ${
                    checked
                      ? "border-volt-500/40 bg-volt-500/10"
                      : "border-white/8 bg-white/3 hover:border-white/20"
                  }`}
                >
                  <span
                    className="flex size-11 items-center justify-center rounded-xl text-white"
                    style={{ background: METHOD_COLORS[m.id] || "#7c3aed" }}
                  >
                    <span className="text-sm font-black">{m.name.charAt(0)}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-black text-white">{m.name}</span>
                    <span className="block truncate text-[11px] text-slate-500">{m.description}</span>
                  </span>
                  <span
                    className={`flex size-5 items-center justify-center rounded-full border-2 ${
                      checked ? "border-volt-500 bg-volt-500" : "border-slate-600"
                    }`}
                  >
                    {checked && <span className="size-1.5 rounded-full bg-white" />}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl glass p-6">
          <h2 className="mb-5 text-base font-black text-white">العروض</h2>
          <Field label="موعد انتهاء عرض اليوم">
            <Input
              dir="ltr"
              type="datetime-local"
              className="text-left"
              value={(form.offerEndsAt as string || "").slice(0, 16)}
              onChange={(e) => set("offerEndsAt", new Date(e.target.value).toISOString())}
            />
          </Field>
        </section>

        <Button size="lg" onClick={save} loading={saving} className="w-full sm:w-auto">
          <Save className="size-5" />
          حفظ الإعدادات
        </Button>
      </div>
    </div>
  );
}