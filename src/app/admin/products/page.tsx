"use client";

import { useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useAdminFetch } from "@/components/admin/use-admin-fetch";
import { useToast } from "@/store/toast";
import { Badge, Button, EmptyState, Input, Select, Skeleton } from "@/components/ui/primitives";
import { Modal } from "@/components/ui/modal";
import { discountPercent, formatPrice } from "@/lib/utils";
import type { Category, Product } from "@/lib/types";

interface AdminProduct extends Product {
  categoryName?: string;
}

export default function AdminProducts() {
  const { data: products, loading, reload } = useAdminFetch<AdminProduct[]>("/api/admin/products-list");
  const { data: categories } = useAdminFetch<Category[]>("/api/categories");
  const toast = useToast();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<AdminProduct | null | "new">(null);
  const [saving, setSaving] = useState(false);

  const filtered = (products || []).filter(
    (p) => p.name.toLowerCase().includes(q.trim().toLowerCase())
  );

  const save = async (payload: Record<string, unknown>) => {
    setSaving(true);
    try {
      const method = payload.id ? "PATCH" : "POST";
      const res = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error("تعذر الحفظ", data.message);
        return;
      }
      toast.success(payload.id ? "تم تحديث المنتج" : "تمت إضافة المنتج", data.product.name);
      setEditing(null);
      reload();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p: AdminProduct) => {
    if (!confirm(`حذف المنتج «${p.name}» نهائيًا؟`)) return;
    const res = await fetch(`/api/admin/products?id=${p.id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      toast.error("تعذر الحذف", data.message);
      return;
    }
    toast.success("تم حذف المنتج");
    reload();
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white md:text-3xl">المنتجات</h1>
          <p className="mt-1.5 text-sm text-slate-400">
            {(products || []).length} منتج في المتجر
          </p>
        </div>
        <Button onClick={() => setEditing("new")}>
          <Plus className="size-4.5" />
          منتج جديد
        </Button>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-600" />
        <Input className="ps-10" placeholder="ابحث عن منتج…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-52 rounded-3xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Plus className="size-7" />} title="لا توجد منتجات" description="أضف أول منتج لمتجرك." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const discount = discountPercent(p.price, p.oldPrice);
            return (
              <div key={p.id} className="group overflow-hidden rounded-3xl glass">
                <div className="relative aspect-[16/10]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.name} className="size-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-night-950/80 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3.5">
                    <span className={`text-xs font-bold ${p.active ? "text-emerald-400" : "text-rose-400"}`}>
                      {p.active ? "منشور" : "مسودة"}
                    </span>
                    {discount > 0 && <Badge tone="rose">-{discount}%</Badge>}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-black text-white">{p.name}</h3>
                      <p className="mt-0.5 text-[11px] text-slate-500">{p.categoryName || "بدون تصنيف"}</p>
                    </div>
                    <p className="shrink-0 text-sm font-black text-gradient">{formatPrice(p.price)}</p>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">
                      المخزون: <span className={p.stock === 0 ? "font-black text-rose-400" : "font-black text-slate-300"}>{p.stock}</span>
                    </span>
                    <span className="size-1 rounded-full bg-slate-700" />
                    <span className="text-[11px] text-slate-500">
                      ⭐ {p.rating} ({p.reviewsCount})
                    </span>
                    <div className="ms-auto flex gap-1.5">
                      <button
                        onClick={() => setEditing(p)}
                        aria-label="تعديل"
                        className="flex size-8 items-center justify-center rounded-lg bg-white/5 text-slate-300 transition hover:text-white"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        onClick={() => remove(p)}
                        aria-label="حذف"
                        className="flex size-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 transition hover:bg-rose-500/20"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ProductFormModal
        open={editing !== null}
        product={editing === "new" ? null : editing}
        categories={categories || []}
        saving={saving}
        onClose={() => setEditing(null)}
        onSave={save}
      />
    </div>
  );
}

function ProductFormModal({
  open,
  product,
  categories,
  saving,
  onClose,
  onSave,
}: {
  open: boolean;
  product: AdminProduct | null;
  categories: Category[];
  saving: boolean;
  onClose: () => void;
  onSave: (p: Record<string, unknown>) => void;
}) {
  const [form, setForm] = useState<Record<string, unknown>>({});

  const init = () => {
    setForm(
      product
        ? {
            id: product.id,
            name: product.name,
            description: product.description,
            categoryId: product.categoryId,
            image: product.image,
            price: product.price,
            oldPrice: product.oldPrice || "",
            stock: product.stock,
            deliveryTime: product.deliveryTime,
            badge: product.badge || "",
            featured: product.featured,
            active: product.active,
          }
        : {
            name: "",
            description: "",
            categoryId: categories[0]?.id || "",
            image: "/images/uc-60.svg",
            price: "",
            oldPrice: "",
            stock: 999,
            deliveryTime: "من 5 إلى 30 دقيقة",
            badge: "",
            featured: false,
            active: true,
          }
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy="product-form-title"
      className="sm:max-w-xl"
    >
      <div className="max-h-[90vh] overflow-y-auto p-6 no-scrollbar">
        <h3 id="product-form-title" className="text-lg font-black text-white">
          {product ? "تعديل المنتج" : "منتج جديد"}
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          الحقول الأساسية — البيانات المتقدمة (المميزات والحقول المطلوبة) تُحفظ كما هي.
        </p>

        <div className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-slate-300">اسم المنتج *</span>
              <Input
                value={(form.name as string) || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="مثال: شدات ببجي 660"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-slate-300">التصنيف</span>
              <Select
                value={(form.categoryId as string) || ""}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="bg-night-800">
                    {c.name}
                  </option>
                ))}
              </Select>
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-300">الوصف</span>
            <Input
              value={(form.description as string) || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="وصف مختصر يظهر في الكارت وصفحة المنتج"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-slate-300">السعر (ج.م) *</span>
              <Input
                dir="ltr"
                type="number"
                className="text-left"
                value={form.price as number}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-slate-300">السعر قبل الخصم</span>
              <Input
                dir="ltr"
                type="number"
                className="text-left"
                value={form.oldPrice as number}
                onChange={(e) =>
                  setForm({ ...form, oldPrice: e.target.value === "" ? "" : Number(e.target.value) })
                }
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-slate-300">المخزون</span>
              <Input
                dir="ltr"
                type="number"
                className="text-left"
                value={form.stock as number}
                onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-slate-300">مدة التنفيذ</span>
              <Input
                value={(form.deliveryTime as string) || ""}
                onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-slate-300">الشارة (badge)</span>
              <Input
                value={(form.badge as string) || ""}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                placeholder="مثال: خصم 20%"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-slate-300">صورة (رابط أو مسار)</span>
              <Input
                dir="ltr"
                className="text-left"
                value={(form.image as string) || ""}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </label>
            <div className="flex items-end gap-4 pb-1">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-slate-300">
                <input
                  type="checkbox"
                  checked={Boolean(form.featured)}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="size-4 accent-volt-500"
                />
                مميز
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-slate-300">
                <input
                  type="checkbox"
                  checked={Boolean(form.active)}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="size-4 accent-volt-500"
                />
                منشور
              </label>
            </div>
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
                oldPrice: form.oldPrice === "" ? null : form.oldPrice,
              })
            }
          >
            {product ? "حفظ التعديلات" : "إضافة المنتج"}
          </Button>
          <Button size="lg" variant="ghost" onClick={onClose}>
            إلغاء
          </Button>
        </div>
      </div>
    </Modal>
  );
}