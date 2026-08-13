"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/common";
import { Button, EmptyState } from "@/components/ui/primitives";

export default function CartPage() {
  const cart = useCart();

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 md:px-6 md:pt-36">
      <Breadcrumbs items={[{ label: "سلة التسوق" }]} />

      <h1 className="mt-5 mb-8 text-3xl font-black text-white md:text-4xl">
        سلة التسوق
      </h1>

      {cart.lines.length === 0 ? (
        <EmptyState
          icon={<ShoppingCart className="size-7" />}
          title="سلتك فارغة حاليًا"
          description="أضف شدات ببجي أو خدمات رقمية لبدء طلبك."
          action={
            <Link href="/products">
              <Button size="lg">تصفح المتجر</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {cart.lines.map((line) => (
                <motion.div
                  key={line.productId}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="flex gap-4 rounded-3xl glass p-4 md:p-5"
                >
                  <Link href={`/products/${line.product.slug}`} className="shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={line.product.image}
                      alt={line.product.name}
                      className="size-20 rounded-2xl border border-white/8 object-cover md:size-24"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link href={`/products/${line.product.slug}`}>
                          <h3 className="truncate text-sm font-black text-white md:text-base">
                            {line.product.name}
                          </h3>
                        </Link>
                        <p className="mt-1 text-xs text-slate-500">
                          {line.product.deliveryTime}
                        </p>
                        {Object.keys(line.customData).length > 0 && (
                          <p className="mt-1.5 text-[11px] leading-5 text-sky-400">
                            {Object.entries(line.customData)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(" • ")}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => cart.removeLine(line.productId)}
                        aria-label="حذف المنتج"
                        className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-400"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-night-800 p-0.5">
                        <button
                          onClick={() => cart.setQuantity(line.productId, line.quantity - 1)}
                          aria-label="إنقاص"
                          className="flex size-7 items-center justify-center rounded-md text-slate-300 hover:text-white"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-black">
                          {line.quantity}
                        </span>
                        <button
                          onClick={() => cart.setQuantity(line.productId, line.quantity + 1)}
                          aria-label="زيادة"
                          className="flex size-7 items-center justify-center rounded-md text-slate-300 hover:text-white"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <p className="text-lg font-black text-gradient">
                        {formatPrice(line.product.price * line.quantity)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <Link href="/products" className="inline-flex items-center gap-2 text-sm font-bold text-volt-300 transition hover:text-volt-400">
              <ArrowLeft className="size-4" />
              متابعة التسوق
            </Link>
          </div>

          <div className="glass-strong h-fit rounded-3xl p-6">
            <h2 className="text-lg font-black text-white">ملخص الطلب</h2>
            <div className="mt-5 space-y-3 border-b border-white/8 pb-5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">الإجمالي الفرعي</span>
                <span className="font-black text-white">{formatPrice(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>الخصم (يُطبق في الدفع)</span>
                <span>0 ج.م</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-base font-black text-white">الإجمالي</span>
              <span className="text-2xl font-black text-gradient">
                {formatPrice(cart.subtotal)}
              </span>
            </div>
            <div className="mt-4 rounded-2xl border border-sky-500/20 bg-sky-500/8 p-3.5 text-[11px] leading-6 text-slate-400">
              💡 سيُطلب منك إدخال بيانات الحساب (Player ID وغيرها) عند إتمام
              الطلب إذا كان المنتج يتطلب ذلك.
            </div>
            <Link
              href="/checkout"
              className="mt-5 block"
              onClick={() => window.scrollTo({ top: 0 })}
            >
              <Button size="lg" className="w-full">
                إتمام الطلب
                <ArrowLeft className="size-5 rotate-180" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}