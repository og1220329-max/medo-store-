import type { Product } from "@/lib/types";

/** نسخة عامة آمنة للمنتج بدون بيانات المخزون والتكلفة الداخلية */
export function publicProduct(product: Product): Omit<Product, "costPrice" | "stock" | "unlimitedStock"> {
  const { costPrice, stock, unlimitedStock, ...rest } = product;
  void costPrice;
  void stock;
  void unlimitedStock;
  return rest;
}