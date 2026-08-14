"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/types";
import { discountPercent, formatPrice } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { useToast } from "@/store/toast";
import { Badge, Button } from "@/components/ui/primitives";
import { Modal } from "@/components/ui/modal";
import { StarRating } from "@/components/ui/common";

export function QuickViewModal({
  product,
  open,
  onClose,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
}) {
  const cart = useCart();
  const toast = useToast();
  const [qty, setQty] = useState(1);
  const discount = discountPercent(product.price, product.oldPrice);

  useEffect(() => {
    if (open) setQty(1);
  }, [open]);

  const add = () => {
    if (product.stock === 0) {
      toast.error("نفد المخزون", "هذا المنتج غير متوفر حاليًا");
      return;
    }
    cart.addToCart(product, qty);
    toast.success("تمت الإضافة للسلة", `${product.name} × ${qty}`);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} labelledBy="quickview-title">
      <div className="grid sm:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-t-3xl bg-night-800 sm:rounded-e-none sm:rounded-s-3xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt={product.name} className="size-full object-cover" />
          {discount > 0 && (
            <Badge tone="rose" className="absolute start-3 top-3">
              خصم {discount}%
            </Badge>
          )}
        </div>

        <div className="p-5 sm:p-6">
          <h3 id="quickview-title" className="text-lg font-black text-white">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center gap-3">
            <StarRating rating={product.rating} />
            <span className="text-xs text-slate-500">
              ({product.reviewsCount} تقييم)
            </span>
          </div>

          <div className="mt-4 flex items-end gap-3">
            <span className="text-2xl font-black text-gradient">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="pb-1 text-sm text-slate-500 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
            {product.description}
          </p>

          <div className="mt-4 space-y-1.5 rounded-2xl bg-white/4 p-3.5 text-xs text-slate-400">
            <p>⚡ مدة التنفيذ: <span className="font-bold text-emerald-400">{product.deliveryTime}</span></p>
            <p>📦 حالة المخزون:{" "}
              <span className="font-bold text-slate-200">
                {product.stock === 0 ? "نفد" : `متوفر (${product.stock.toLocaleString("ar-EG")})`}
              </span>
            </p>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-night-800 p-1">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="إنقاص الكمية"
                className="flex size-8 items-center justify-center rounded-lg text-slate-300 hover:text-white"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-8 text-center text-sm font-black">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                aria-label="زيادة الكمية"
                className="flex size-8 items-center justify-center rounded-lg text-slate-300 hover:text-white"
              >
                <Plus className="size-4" />
              </button>
            </div>
            <Button className="flex-1" onClick={add}>
              <ShoppingCart className="size-4.5" />
              أضف للسلة
            </Button>
          </div>

          <Link
            href={`/products/${product.slug}`}
            onClick={onClose}
            className="mt-4 block rounded-xl border border-volt-500/30 bg-volt-500/10 py-2.5 text-center text-sm font-bold text-volt-300 transition hover:bg-volt-500/20 focus-ring"
          >
            عرض التفاصيل كاملة
          </Link>
        </div>
      </div>
    </Modal>
  );
}