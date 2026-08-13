"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BellRing, ClipboardList, LogOut, Package, UserRound, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/primitives";
import { formatDate, formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/constants";

interface Profile {
  user: { id: string; name: string; email: string; phone: string; createdAt: string };
}

interface Orders {
  id: string;
  number: string;
  status: string;
  payment: { status: string; method: string };
  total: number;
  createdAt: string;
  items: { name: string; image: string; quantity: number }[];
}

interface Notif {
  id: string;
  title: string;
  body?: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export default function AccountDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile["user"] | null>(null);
  const [orders, setOrders] = useState<Orders[] | null>(null);
  const [notifs, setNotifs] = useState<Notif[] | null>(null);

  useEffect(() => {
    fetch("/api/account/profile", { cache: "no-store" }).then((r) => r.json()).then((d) => d.user && setProfile(d.user));
    fetch("/api/account/orders", { cache: "no-store" }).then((r) => r.json()).then((d) => Array.isArray(d) && setOrders(d));
    fetch("/api/account/notifications", { cache: "no-store" }).then((r) => r.json()).then((d) => d.items && setNotifs(d.items));
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");
    router.refresh();
  };

  const badge = (status: string) =>
    ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS] || status;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl glass p-6">
        <div className="flex items-center gap-4">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-volt-600 to-glow-600 shadow-glow">
            <UserRound className="size-7 text-white" />
          </span>
          <div>
            <p className="text-lg font-black text-white">{profile ? profile.name : "..."}</p>
            <p className="text-sm text-slate-400" dir="ltr">
              {profile ? profile.email : ""}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/account/orders"
            className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10"
          >
            <ClipboardList className="size-4" />
            طلباتي
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-xl bg-rose-500/10 px-4 py-2.5 text-sm font-bold text-rose-400 hover:bg-rose-500/20"
          >
            <LogOut className="size-4" />
            خروج
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl glass p-5">
          <span className="mb-3 flex size-10 items-center justify-center rounded-xl bg-volt-500/10 text-volt-400">
            <Package className="size-5" />
          </span>
          <p className="text-2xl font-black text-white">{(orders?.length || 0).toLocaleString("ar-EG")}</p>
          <p className="mt-1 text-xs text-slate-500">إجمالي الطلبات</p>
        </div>
        <div className="rounded-3xl glass p-5">
          <span className="mb-3 flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <BellRing className="size-5" />
          </span>
          <p className="text-2xl font-black text-white">{(notifs?.filter((n) => !n.read).length || 0).toLocaleString("ar-EG")}</p>
          <p className="mt-1 text-xs text-slate-500">إشعارات غير مقروءة</p>
        </div>
        <div className="rounded-3xl glass p-5">
          <span className="mb-3 flex size-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
            <ClipboardList className="size-5" />
          </span>
          <p className="text-2xl font-black text-white">
            {orders ? formatPrice(orders.reduce((a, o) => a + (o.payment.status === "paid" ? o.total : 0), 0)) : "..."}
          </p>
          <p className="mt-1 text-xs text-slate-500">إجمالي المشتريات</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl glass p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-black text-white">أحدث طلباتك</h2>
            <Link href="/account/orders" className="flex items-center gap-1 text-xs font-bold text-volt-400 hover:text-volt-300">
              الكل
              <ArrowLeft className="size-3.5" />
            </Link>
          </div>
          {!orders ? (
            <Skeleton className="h-24 rounded-2xl" />
          ) : orders.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">لا توجد طلبات بعد — ابدأ التسوق!</p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 4).map((o) => (
                <Link
                  key={o.id}
                  href="/account/orders"
                  className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/2 p-3 transition hover:border-white/10"
                >
                  <img src={o.items[0]?.image} alt="" className="size-11 rounded-xl bg-night-800 object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-white">{o.items[0]?.name || o.number}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{formatDate(o.createdAt)}</p>
                  </div>
                  <div className="text-end">
                    <p className="text-sm font-black text-white">{formatPrice(o.total)}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{badge(o.status)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl glass p-6">
          <h2 className="mb-4 text-base font-black text-white">آخر الإشعارات</h2>
          {!notifs ? (
            <Skeleton className="h-24 rounded-2xl" />
          ) : notifs.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">لا توجد إشعارات</p>
          ) : (
            <div className="space-y-3">
              {notifs.slice(0, 5).map((n) => (
                <div key={n.id} className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/2 p-3">
                  <span className={`mt-1 size-2 shrink-0 rounded-full ${n.read ? "bg-slate-600" : "bg-volt-400"}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white">{n.title}</p>
                    {n.body && <p className="mt-0.5 text-xs text-slate-400 line-clamp-2">{n.body}</p>}
                    <p className="mt-1 text-[11px] text-slate-600">{formatDate(n.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="mt-3 text-[11px] text-slate-600">
            {PAYMENT_STATUS_LABELS.paid} — الدعم متاح على واتساب.
          </p>
        </div>
      </div>
    </div>
  );
}