"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BellRing, Home, Package, ShoppingCart, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";

export function MobileBottomNav() {
  const pathname = usePathname();
  const cart = useCart();

  if (pathname.startsWith("/admin")) return null;

  const items = [
    { href: "/", label: "الرئيسية", icon: Home },
    { href: "/products", label: "المتجر", icon: Package },
    { href: "/cart", label: "السلة", icon: ShoppingCart, badge: cart.count },
    { href: "/account", label: "حسابي", icon: UserRound },
    { href: "/orders/track", label: "التتبع", icon: BellRing },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/8 bg-night-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden">
      <div className="grid grid-cols-5">
        {items.map((it) => {
          const active =
            it.href === "/"
              ? pathname === "/"
              : pathname.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-bold transition",
                active ? "text-volt-400" : "text-slate-500 hover:text-slate-300"
              )}
            >
              <span className="relative">
                <it.icon className="size-5" />
                {!!it.badge && it.badge > 0 && (
                  <span className="absolute -end-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-volt-600 text-[9px] font-black text-white">
                    {it.badge > 9 ? "9+" : it.badge}
                  </span>
                )}
              </span>
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}