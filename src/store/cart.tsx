"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine, CartLineDetailed, Product } from "@/lib/types";

interface CartContextValue {
  lines: CartLineDetailed[];
  count: number;
  subtotal: number;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (
    product: Product,
    quantity?: number,
    customData?: Record<string, string>
  ) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeLine: (productId: string) => void;
  clearCart: () => void;
  hasItem: (productId: string) => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "medo_cart_v1";

function stripCustomData(line: CartLine): CartLine {
  const cleaned: Record<string, string> = {};
  for (const [k, v] of Object.entries(line.customData || {})) {
    if (v && v.trim()) cleaned[k] = v.trim();
  }
  return {
    productId: line.productId,
    quantity: line.quantity,
    customData: cleaned,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? (data as Product[]) : [];
        setProducts(list);
      })
      .catch(() => {
        /* تُترك السلة فارغة مؤقتًا */
      });
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, hydrated]);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const productMap = useMemo(() => {
    const map = new Map<string, Product>();
    for (const p of products) map.set(p.id, p);
    return map;
  }, [products]);

  const addToCart = useCallback(
    (product: Product, quantity = 1, customData: Record<string, string> = {}) => {
      setProducts((prev) =>
        prev.some((p) => p.id === product.id) ? prev : [...prev, product]
      );
      const line = { productId: product.id, quantity, customData };
      setLines((prev) => {
        const existing = prev.find((l) => l.productId === product.id);
        const cleaned = stripCustomData(line);
        if (existing) {
          return prev.map((l) =>
            l.productId === product.id
              ? {
                  ...l,
                  quantity: l.quantity + cleaned.quantity,
                  customData: cleaned.customData,
                }
              : l
          );
        }
        return [...prev, cleaned];
      });
      setDrawerOpen(true);
    },
    []
  );

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.productId !== productId)
        : prev.map((l) =>
            l.productId === productId ? { ...l, quantity } : l
          )
    );
  }, []);

  const removeLine = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);
  const hasItem = useCallback(
    (productId: string) => lines.some((l) => l.productId === productId),
    [lines]
  );

  const value = useMemo<CartContextValue>(() => {
    const detailed: CartLineDetailed[] = [];
    let subtotal = 0;
    for (const line of lines) {
      const product = productMap.get(line.productId);
      if (!product) continue;
      detailed.push({ ...line, product });
      subtotal += product.price * line.quantity;
    }
    return {
      lines: detailed,
      count: detailed.reduce((sum, l) => sum + l.quantity, 0),
      subtotal,
      drawerOpen,
      openDrawer,
      closeDrawer,
      addToCart,
      setQuantity,
      removeLine,
      clearCart,
      hasItem,
    };
  }, [
    lines,
    productMap,
    drawerOpen,
    openDrawer,
    closeDrawer,
    addToCart,
    setQuantity,
    removeLine,
    clearCart,
    hasItem,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}