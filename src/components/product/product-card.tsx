"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Plus, Zap } from "lucide-react";
import type { Product } from "@/lib/types";
import { discountPercent, formatPrice } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { useToast } from "@/store/toast";
import { Badge, Button } from "@/components/ui/primitives";
import { StarRating } from "@/components/ui/common";
import { QuickViewModal } from "@/components/product/quick-view";

function stockStatus(product: Product): { label: string; tone: "emerald" | "amber" | "rose" } {
  if (product.stock === 0) return { label: "نفد المخزون", tone: "rose" };
  if (product.stock < 10) return { label: "كمية محدودة", tone: "amber" };
  return { label: "متوفر", tone: "emerald" };
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const cart = useCart();
  const toast = useToast();
  const [quickView, setQuickView] = useState(false);
  const discount = discountPercent(product.price, product.oldPrice);
  const stock = stockStatus(product);

  const add = () => {
    if (product.stock === 0) {
      toast.error("نفد المخزون", "هذا المنتج غير متوفر حاليًا");
      return;
    }
    cart.addToCart(product, 1);
    toast.success("تمت الإضافة للسلة", product.name);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.3) }}
        whileHover={{ y: -6 }}
        className="group relative flex flex-col overflow-hidden rounded-3xl glass transition-shadow duration-300 hover:shadow-glow-lg"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-night-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night-900/70 via-transparent to-transparent" />

          <div className="absolute start-3 top-3 flex flex-col items-start gap-1.5">
            {discount > 0 && (
              <Badge tone="rose">خصم {discount}%</Badge>
            )}
            {product.badge && <Badge tone="volt">{product.badge}</Badge>}
          </div>

          <span
            className={`absolute end-3 top-3 flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold backdrop-blur-sm ${
              stock.tone === "emerald"
                ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                : stock.tone === "amber"
                ? "border-amber-500/30 bg-amber-500/15 text-amber-300"
                : "border-rose-500/30 bg-rose-500/15 text-rose-300"
            }`}
          >
            {stock.label}
          </span>

          <div className="absolute inset-x-3 bottom-3 flex translate-y-16 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <Button
              variant="glass"
              size="sm"
              className="flex-1"
              onClick={add}
              aria-label={`أضف ${product.name} للسلة`}
            >
              <Plus className="size-4" />
              أضف للسلة
            </Button>
            <button
              onClick={() => setQuickView(true)}
              aria-label="عرض سريع"
              className="flex size-9 items-center justify-center rounded-xl glass text-slate-200 transition hover:text-white"
            >
              <Eye className="size-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <StarRating rating={product.rating} size="size-3.5" />
            <span className="text-[11px] font-semibold text-slate-500">
              {product.reviewsCount} تقييم
            </span>
          </div>
          <Link href={`/products/${product.slug}`} className="focus-ring rounded-lg">
            <h3 className="text-base font-black text-white transition group-hover:text-volt-300">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
            {product.description}
          </p>

          <div className="mt-auto flex items-end justify-between pt-4">
            <div>
              {product.oldPrice && product.oldPrice > product.price && (
                <p className="text-xs text-slate-500 line-through">
                  {formatPrice(product.oldPrice)}
                </p>
              )}
              <p className="text-lg font-black text-gradient">
                {formatPrice(product.price)}
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
              <Zap className="size-3.5" />
              {product.deliveryTime}
            </span>
          </div>
        </div>
      </motion.div>

      <QuickViewModal
        product={product}
        open={quickView}
        onClose={() => setQuickView(false)}
      />
    </>
  );
}