"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/primitives";

export function CartDrawer() {
  const cart = useCart();

  return (
    <AnimatePresence>
      {cart.drawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[65] bg-night-950/75 backdrop-blur-sm"
            onClick={cart.closeDrawer}
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-[66] flex w-full max-w-md flex-col border-e border-white/8 bg-night-900 shadow-2xl"
            role="dialog"
            aria-label="سلة التسوق"
          >
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
              <h2 className="flex items-center gap-2 text-lg font-black text-white">
                <ShoppingCart className="size-5 text-volt-400" />
                سلة التسوق
                {cart.count > 0 && (
                  <span className="rounded-full bg-volt-500/20 px-2.5 py-0.5 text-xs font-black text-volt-300">
                    {cart.count}
                  </span>
                )}
              </h2>
              <button
                onClick={cart.closeDrawer}
                aria-label="إغلاق السلة"
                className="flex size-9 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <X className="size-4.5" />
              </button>
            </div>

            {cart.lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <div className="flex size-20 items-center justify-center rounded-3xl bg-white/5 text-slate-600">
                  <ShoppingCart className="size-9" />
                </div>
                <div>
                  <p className="text-base font-bold text-slate-300">سلتك فارغة</p>
                  <p className="mt-1.5 text-sm leading-6 text-slate-500">
                    أضف شدات ببجي أو خدمات رقمية وابدأ طلبك الآن
                  </p>
                </div>
                <Link href="/products" onClick={cart.closeDrawer}>
                  <Button variant="outline">تصفح المتجر</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                  <AnimatePresence initial={false}>
                    {cart.lines.map((line) => (
                      <motion.div
                        key={line.productId}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        className="flex gap-3 rounded-2xl glass p-3"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={line.product.image}
                          alt={line.product.name}
                          className="size-16 shrink-0 rounded-xl bg-white/5 object-cover"
                        />
                        <div className="flex min-w-0 flex-1 flex-col">
                          <p className="truncate text-sm font-bold text-white">
                            {line.product.name}
                          </p>
                          <p className="mt-0.5 text-xs text-volt-300">
                            {formatPrice(line.product.price)}
                          </p>
                          <div className="mt-auto flex items-center justify-between pt-1.5">
                            <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-night-800 p-0.5">
                              <button
                                onClick={() => cart.setQuantity(line.productId, line.quantity - 1)}
                                aria-label="إنقاص"
                                className="flex size-6 items-center justify-center rounded-md text-slate-300 hover:text-white"
                              >
                                <Minus className="size-3.5" />
                              </button>
                              <span className="w-6 text-center text-sm font-black text-white">
                                {line.quantity}
                              </span>
                              <button
                                onClick={() => cart.setQuantity(line.productId, line.quantity + 1)}
                                aria-label="زيادة"
                                className="flex size-6 items-center justify-center rounded-md text-slate-300 hover:text-white"
                              >
                                <Plus className="size-3.5" />
                              </button>
                            </div>
                            <button
                              onClick={() => cart.removeLine(line.productId)}
                              aria-label="حذف"
                              className="flex size-7 items-center justify-center rounded-lg text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-400"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="border-t border-white/8 p-5">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-slate-400">الإجمالي الفرعي</span>
                    <span className="font-black text-white">
                      {formatPrice(cart.subtotal)}
                    </span>
                  </div>
                  <p className="mb-4 text-xs text-slate-600">
                    الخصومات والكوبونات تُطبق عند إتمام الطلب
                  </p>
                  <div className="grid gap-2.5">
                    <Link href="/checkout" onClick={cart.closeDrawer} className="block">
                      <Button className="w-full" size="lg">
                        إتمام الطلب
                      </Button>
                    </Link>
                    <Link
                      href="/cart"
                      onClick={cart.closeDrawer}
                      className="block text-center text-sm font-bold text-slate-400 transition hover:text-volt-300"
                    >
                      عرض كامل السلة
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}