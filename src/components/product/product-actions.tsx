"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import type { Product, RequiredField } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { useToast } from "@/store/toast";
import { Button, Input, Select, Field } from "@/components/ui/primitives";
import { Modal } from "@/components/ui/modal";

export function ProductActions({ product }: { product: Product }) {
  const cart = useCart();
  const toast = useToast();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [dataModal, setDataModal] = useState(false);
  const [requiredData, setRequiredData] = useState<Record<string, string>>({});
  const [mode, setMode] = useState<"cart" | "buy">("cart");

  const hasDataFields = product.requiredFields.length > 0;
  const stockOut = product.stock === 0;

  const doAdd = (customData: Record<string, string>) => {
    cart.addToCart(product, qty, customData);
    toast.success("تمت الإضافة للسلة", `${product.name} × ${qty}`);
  };

  const handleAdd = () => {
    if (stockOut) {
      toast.error("نفد المخزون", "هذا المنتج غير متوفر حاليًا");
      return;
    }
    if (hasDataFields) {
      setMode("cart");
      setDataModal(true);
      return;
    }
    doAdd({});
  };

  const handleBuy = () => {
    if (stockOut) {
      toast.error("نفد المخزون", "هذا المنتج غير متوفر حاليًا");
      return;
    }
    if (hasDataFields) {
      setMode("buy");
      setDataModal(true);
      return;
    }
    cart.addToCart(product, qty);
    router.push("/checkout");
  };

  const submitData = () => {
    for (const f of product.requiredFields) {
      if (f.required && !(requiredData[f.key] || "").trim()) {
        toast.error("بيانات ناقصة", `يرجى إدخال: ${f.label}`);
        return;
      }
    }
    if (mode === "cart") {
      doAdd(requiredData);
    } else {
      cart.addToCart(product, qty, requiredData);
      router.push("/checkout");
    }
    setDataModal(false);
  };

  return (
    <>
      <div className="mt-7 space-y-4">
        <div className="flex items-center gap-3.5">
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-night-800 p-1">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="إنقاص الكمية"
              className="flex size-9 items-center justify-center rounded-lg text-slate-300 transition hover:text-white"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-9 text-center text-base font-black">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(50, q + 1))}
              aria-label="زيادة الكمية"
              className="flex size-9 items-center justify-center rounded-lg text-slate-300 transition hover:text-white"
            >
              <Plus className="size-4" />
            </button>
          </div>
          <div className="text-xs text-slate-500">
            الإجمالي:{" "}
            <span className="font-black text-volt-300">
              {formatPrice(product.price * qty)}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="flex-1" onClick={handleAdd} disabled={stockOut}>
            <ShoppingCart className="size-5" />
            أضف إلى السلة
          </Button>
          <Button size="lg" variant="white" className="flex-1" onClick={handleBuy} disabled={stockOut}>
            <Zap className="size-5 text-volt-600" />
            اشترِ الآن
          </Button>
        </div>
      </div>

      <RequiredDataModal
        open={dataModal}
        fields={product.requiredFields}
        values={requiredData}
        onChange={setRequiredData}
        onClose={() => setDataModal(false)}
        onSubmit={submitData}
      />
    </>
  );
}

function RequiredDataModal({
  open,
  fields,
  values,
  onChange,
  onClose,
  onSubmit,
}: {
  open: boolean;
  fields: RequiredField[];
  values: Record<string, string>;
  onChange: (v: Record<string, string>) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="req-title">
      <div className="p-6">
        <h3 id="req-title" className="text-lg font-black text-white">
          بيانات مطلوبة للمنتج
        </h3>
        <p className="mt-1.5 text-xs leading-6 text-slate-400">
          أدخل البيانات التالية لضمان تنفيذ طلبك بشكل صحيح وسريع.
        </p>

        <div className="mt-5 space-y-4">
          {fields.map((field) => (
            <Field
              key={field.key}
              label={field.label}
              hint={
                field.required
                  ? field.hint
                  : `${field.hint || ""} ${field.required ? "" : "— اختياري"}`
              }
            >
              {field.type === "select" ? (
                <Select
                  value={values[field.key] || ""}
                  onChange={(e) =>
                    onChange({ ...values, [field.key]: e.target.value })
                  }
                >
                  <option value="" className="bg-night-800">
                    اختر…
                  </option>
                  {(field.options || []).map((opt) => (
                    <option key={opt} value={opt} className="bg-night-800">
                      {opt}
                    </option>
                  ))}
                </Select>
              ) : (
                <Input
                  type={field.type === "number" ? "number" : "text"}
                  placeholder={field.placeholder}
                  value={values[field.key] || ""}
                  onChange={(e) =>
                    onChange({ ...values, [field.key]: e.target.value })
                  }
                />
              )}
            </Field>
          ))}
        </div>

        <Button className="mt-6 w-full" size="lg" onClick={onSubmit}>
          متابعة الطلب
        </Button>
        <p className="mt-3 text-center text-[11px] text-slate-600">
          بياناتك تُستخدم فقط لتنفيذ الطلب ولا تُشارك مع أي طرف آخر.
        </p>
      </div>
    </Modal>
  );
}