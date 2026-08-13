"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LifeBuoy, Package, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/account", label: "نظرة عامة", icon: UserRound, exact: true },
  { href: "/account/orders", label: "طلباتي", icon: Package },
  { href: "/account/tickets", label: "تذاكر الدعم", icon: LifeBuoy },
];

export function AccountNav() {
  const pathname = usePathname();
  return (
    <div className="mb-8 flex gap-2 overflow-x-auto no-scrollbar">
      {TABS.map((t) => {
        const active = t.exact ? pathname === t.href : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition",
              active
                ? "border border-volt-500/30 bg-volt-500/10 text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <t.icon className="size-4" />
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}