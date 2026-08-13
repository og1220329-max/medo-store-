"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart3,
  CreditCard,
  History,
  Image as ImageIcon,
  LayoutDashboard,
  LayoutTemplate,
  LifeBuoy,
  LogOut,
  MessageSquare,
  Package,
  Settings,
  ShoppingBag,
  Star,
  Tag,
  TicketPercent,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "الطلبات", icon: ShoppingBag },
  { href: "/admin/products", label: "المنتجات", icon: Package },
  { href: "/admin/customers", label: "العملاء", icon: Users },
  { href: "/admin/coupons", label: "كوبونات الخصم", icon: Tag },
  { href: "/admin/offers", label: "العروض", icon: TicketPercent },
  { href: "/admin/banners", label: "البنرات", icon: ImageIcon },
  { href: "/admin/homepage", label: "مصمم الرئيسية", icon: LayoutTemplate },
  { href: "/admin/reviews", label: "التقييمات", icon: Star },
  { href: "/admin/support", label: "دعم العملاء", icon: LifeBuoy },
  { href: "/admin/messages", label: "رسائل الدعم", icon: MessageSquare },
  { href: "/admin/payments", label: "المدفوعات", icon: CreditCard },
  { href: "/admin/users", label: "المستخدمون", icon: Users },
  { href: "/admin/analytics", label: "التحليلات", icon: BarChart3 },
  { href: "/admin/audit-logs", label: "سجل العمليات", icon: History },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
];

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<"loading" | "ok" | "denied">("loading");

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (!data?.user || data.user.role !== "admin") {
          setStatus("denied");
          router.replace("/auth/login?next=/admin");
        } else {
          setStatus("ok");
        }
      })
      .catch(() => router.replace("/auth/login?next=/admin"));
  }, [router, pathname]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");
    router.refresh();
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="size-10 animate-spin rounded-full border-3 border-volt-500 border-t-transparent" />
      </div>
    );
  }

  if (status === "denied") return null;

  return (
    <div className="min-h-screen bg-night-950">
      <aside className="fixed inset-y-0 right-0 z-40 hidden w-64 flex-col border-l border-white/8 bg-night-900/80 px-4 py-6 lg:flex">
        <Link href="/" className="mb-8 flex items-center gap-2.5 px-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-volt-600 to-glow-600 shadow-glow">
            <Package className="size-4.5 text-white" />
          </span>
          <span className="text-base font-black text-white">
            MEDO <span className="text-gradient">STORE</span>
            <span className="ms-2 rounded-md bg-volt-500/20 px-1.5 py-0.5 text-[10px] font-black text-volt-300">
              ADMIN
            </span>
          </span>
        </Link>

        <nav className="flex-1 space-y-1">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold transition",
                  active
                    ? "border border-volt-500/30 bg-volt-500/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="size-4.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-white/8 pt-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            متجر زائر
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold text-rose-400 transition hover:bg-rose-500/10"
          >
            <LogOut className="size-4.5" />
            خروج
          </button>
        </div>
      </aside>

      <div className="lg:ps-64">
        <MobileAdminNav pathname={pathname} onLogout={logout} />
        <main className="px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}

function MobileAdminNav({
  pathname,
  onLogout,
}: {
  pathname: string;
  onLogout: () => void;
}) {
  return (
    <div className="sticky top-0 z-30 mb-6 flex gap-1 overflow-x-auto border-b border-white/8 bg-night-900/85 px-3 py-2.5 backdrop-blur-lg lg:hidden no-scrollbar">
      {NAV.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition",
              active ? "bg-volt-500/15 text-white" : "text-slate-400"
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
      <button
        onClick={onLogout}
        className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-rose-400"
      >
        <LogOut className="size-4" />
        خروج
      </button>
    </div>
  );
}