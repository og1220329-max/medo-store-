"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Search,
  ShoppingCart,
  User,
  X,
  Menu,
  ChevronDown,
  BellRing,
  MessageCircle,
  Send,
  Headphones,
  Package,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { PubgLogo } from "./pubg-logo";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [socials, setSocials] = useState<Record<string, string>>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [pubgDropdown, setPubgDropdown] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const cart = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => {});
  }, [pathname]);

  useEffect(() => {
    fetch("/api/site", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.settings) setSocials(d.settings);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Top Banner Bar */}
      <div className="bg-[#8b000a] text-white flex items-center justify-between px-4 md:px-8 py-1.5 text-xs w-full z-50 relative border-b border-red-900/40">
        {/* Left (in LTR) / Far Left: Currency Selector */}
        <div className="flex items-center justify-start">
          <button className="flex items-center gap-1 bg-black/25 hover:bg-black/40 px-2.5 py-1 rounded text-white/90 transition text-[11px] font-medium border border-white/10">
            <span>جنيه مصري</span>
            <ChevronDown className="size-3" />
          </button>
        </div>

        {/* Center: Promo Announcement */}
        <div className="text-center font-bold text-white/95 text-xs tracking-wide flex items-center justify-center gap-1.5">
          <span>🔥</span>
          <span>خصم 20% على جميع المنتجات لفترة محدودة!</span>
        </div>

        {/* Right: Technical Support + Track Order + Social Icons */}
        <div className="flex items-center gap-3 md:gap-5 justify-end">
          <div className="hidden sm:flex items-center gap-4 text-white/90">
            <Link
              href="/contact"
              className="hover:text-white transition flex items-center gap-1 text-[11px]"
            >
              <Headphones className="size-3.5 text-red-300" />
              <span>الدعم الفني</span>
            </Link>
            <Link
              href="/orders/track"
              className="hover:text-white transition flex items-center gap-1 text-[11px]"
            >
              <Package className="size-3.5 text-red-300" />
              <span>تتبع الطلب</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 border-r border-white/20 pr-3">
            <a
              href="https://wa.me/201202053951"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="واتساب"
              className="text-white/80 hover:text-white transition"
            >
              <MessageCircle className="size-3.5" />
            </a>
            <a
              href="https://t.me/medostore"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="تيليجرام"
              className="text-white/80 hover:text-white transition"
            >
              <Send className="size-3.5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="إنستجرام"
              className="text-white/80 hover:text-white transition"
            >
              <Instagram className="size-3.5" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="فيسبوك"
              className="text-white/80 hover:text-white transition"
            >
              <Facebook className="size-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header
        className={cn(
          "inset-x-0 z-40 transition-all duration-300 border-b border-white/5",
          scrolled
            ? "fixed top-0 bg-[#0c0d12]/95 backdrop-blur-md shadow-xl"
            : "bg-[#0a0b0f] relative"
        )}
      >
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-4 md:px-8">
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="lg:hidden text-white p-1 hover:text-slate-300 transition"
              aria-label="القائمة"
            >
              {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
            <Link href="/" aria-label="الرئيسية" className="hover:opacity-95 transition">
              <PubgLogo />
            </Link>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8">
            <Link
              href="/"
              className={cn(
                "text-sm font-bold transition py-2 relative",
                pathname === "/"
                  ? "text-[#DF0112] after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-[#DF0112]"
                  : "text-slate-300 hover:text-white"
              )}
            >
              الرئيسية
            </Link>

            <Link
              href="/products"
              className={cn(
                "text-sm font-bold transition py-2 relative",
                pathname.startsWith("/products")
                  ? "text-[#DF0112] after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-[#DF0112]"
                  : "text-slate-300 hover:text-white"
              )}
            >
              المتجر
            </Link>

            {/* PUBG UC Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setPubgDropdown(true)}
              onMouseLeave={() => setPubgDropdown(false)}
            >
              <button
                className={cn(
                  "flex items-center gap-1 text-sm font-bold transition py-2",
                  pathname.includes("pubg")
                    ? "text-[#DF0112]"
                    : "text-slate-300 hover:text-white"
                )}
              >
                <span>شدات ببجي</span>
                <ChevronDown className="size-3.5 transition group-hover:rotate-180" />
              </button>

              <AnimatePresence>
                {pubgDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 top-full mt-1 w-48 rounded-xl bg-[#12141c] border border-white/10 p-2 shadow-2xl z-50"
                  >
                    <Link
                      href="/categories/pubg-uc"
                      className="block px-3 py-2 text-xs font-bold text-slate-200 hover:text-white hover:bg-white/5 rounded-lg transition"
                    >
                      شدات ببجي العالمية
                    </Link>
                    <Link
                      href="/categories/bundles"
                      className="block px-3 py-2 text-xs font-bold text-slate-200 hover:text-white hover:bg-white/5 rounded-lg transition"
                    >
                      باقات ببجي المميزة
                    </Link>
                    <Link
                      href="/categories/pubg-kr"
                      className="block px-3 py-2 text-xs font-bold text-slate-200 hover:text-white hover:bg-white/5 rounded-lg transition"
                    >
                      شدات ببجي الكورية
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdown(true)}
              onMouseLeave={() => setServicesDropdown(false)}
            >
              <button
                className={cn(
                  "flex items-center gap-1 text-sm font-bold transition py-2",
                  pathname.includes("services")
                    ? "text-[#DF0112]"
                    : "text-slate-300 hover:text-white"
                )}
              >
                <span>الخدمات</span>
                <ChevronDown className="size-3.5 transition" />
              </button>

              <AnimatePresence>
                {servicesDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 top-full mt-1 w-48 rounded-xl bg-[#12141c] border border-white/10 p-2 shadow-2xl z-50"
                  >
                    <Link
                      href="/categories/pubg-services"
                      className="block px-3 py-2 text-xs font-bold text-slate-200 hover:text-white hover:bg-white/5 rounded-lg transition"
                    >
                      خدمات حسابات ببجي
                    </Link>
                    <Link
                      href="/services/social-media"
                      className="block px-3 py-2 text-xs font-bold text-slate-200 hover:text-white hover:bg-white/5 rounded-lg transition"
                    >
                      خدمات السوشيال ميديا
                    </Link>
                    <Link
                      href="/categories/digital"
                      className="block px-3 py-2 text-xs font-bold text-slate-200 hover:text-white hover:bg-white/5 rounded-lg transition"
                    >
                      بطاقات رقمية وشحن
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/offers"
              className={cn(
                "text-sm font-bold transition py-2 relative",
                pathname.startsWith("/offers")
                  ? "text-[#DF0112] after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-[#DF0112]"
                  : "text-slate-300 hover:text-white"
              )}
            >
              العروض
            </Link>

            <Link
              href="/orders/track"
              className={cn(
                "text-sm font-bold transition py-2 relative",
                pathname.startsWith("/orders")
                  ? "text-[#DF0112] after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-[#DF0112]"
                  : "text-slate-300 hover:text-white"
              )}
            >
              تتبع الطلب
            </Link>

            <Link
              href="/contact"
              className={cn(
                "text-sm font-bold transition py-2 relative",
                pathname.startsWith("/contact")
                  ? "text-[#DF0112] after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-[#DF0112]"
                  : "text-slate-300 hover:text-white"
              )}
            >
              تواصل معنا
            </Link>
          </nav>

          {/* Right Tools (Search, Cart, Auth) */}
          <div className="flex items-center gap-3">
            {/* Search Input Button */}
            <div className="hidden lg:flex relative items-center">
              <input
                type="text"
                placeholder="ابحث عن منتج..."
                className="bg-[#11131a] border border-white/10 rounded-lg pr-4 pl-9 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-white/20 w-44 xl:w-56 transition cursor-pointer hover:bg-[#161822]"
                onClick={() => setSearchOpen(true)}
                readOnly
              />
              <Search className="size-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            </div>

            <button
              onClick={() => setSearchOpen(true)}
              className="lg:hidden text-white hover:text-slate-300 p-2 transition"
              aria-label="البحث"
            >
              <Search className="size-5" />
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={cart.openDrawer}
              aria-label="سلة التسوق"
              className="relative flex items-center justify-center size-9 rounded-lg bg-[#11131a] border border-white/10 text-white hover:bg-white/10 transition"
            >
              <ShoppingCart className="size-4" />
              <span className="absolute -top-1.5 -right-1.5 flex size-4.5 items-center justify-center rounded-full bg-[#DF0112] text-[10px] font-black text-white shadow-sm">
                {cart.count > 0 ? (cart.count > 99 ? "99+" : cart.count) : 3}
              </span>
            </button>

            {/* User Auth Buttons */}
            {user ? (
              <Link
                href={user.role === "admin" ? "/admin" : "/account"}
                className="flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-bold bg-[#DF0112] text-white hover:bg-[#c20110] transition shadow-md shadow-red-950/40"
              >
                <User className="size-3.5" />
                <span>{user.name.split(" ")[0] || "حسابي"}</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="hidden sm:flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-xs font-bold border border-white/20 text-white hover:bg-white/5 transition"
                >
                  <User className="size-3.5 text-slate-300" />
                  <span>تسجيل الدخول</span>
                </Link>
                <Link
                  href="/auth/register"
                  className="flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-xs font-bold bg-[#DF0112] text-white hover:bg-[#c20110] transition shadow-md shadow-red-950/40"
                >
                  <UserPlus className="size-3.5" />
                  <span>إنشاء حساب</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} user={user} />

      {/* Quick Search Overlay */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function MobileNav({
  open,
  onClose,
  user,
}: {
  open: boolean;
  onClose: () => void;
  user: { name: string; email: string; role: string } | null;
}) {
  const pathname = usePathname();
  const links = [
    { href: "/", label: "الرئيسية" },
    { href: "/products", label: "المتجر" },
{ href: "/categories/pubg-uc", label: "شدات ببجي" },
    { href: "/categories/bundles", label: "باقات ببجي" },
    { href: "/categories/pubg-services", label: "خدمات ببجي" },
    { href: "/categories/pubg-kr", label: "ببجي كوريا" },
    { href: "/categories/digital", label: "منتجات رقمية" },
    { href: "/offers", label: "العروض" },
    { href: "/orders/track", label: "تتبع الطلب" },
    { href: "/contact", label: "تواصل معنا" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex flex-col bg-[#0b0c10]/98 backdrop-blur-xl lg:hidden"
        >
          <div className="flex h-16 items-center justify-between px-5 border-b border-white/10">
            <PubgLogo />
            <button
              onClick={onClose}
              aria-label="إغلاق"
              className="flex size-9 items-center justify-center rounded-lg bg-white/5 text-slate-300"
            >
              <X className="size-5" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 pb-6 pt-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition",
                  pathname === link.href
                    ? "bg-[#DF0112]/15 border border-[#DF0112]/40 text-[#DF0112]"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                )}
              >
                {link.label}
                <ChevronDown className="size-4 rotate-270 text-slate-600" />
              </Link>
            ))}

            <div className="mt-4 grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
              {user ? (
                <Link
                  href={user.role === "admin" ? "/admin" : "/account"}
                  onClick={onClose}
                  className="col-span-2 flex h-11 items-center justify-center gap-2 rounded-xl bg-[#DF0112] text-sm font-bold text-white shadow-lg"
                >
                  <User className="size-4" />
                  حسابي — {user.name.split(" ")[0]}
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={onClose}
                    className="flex h-11 items-center justify-center rounded-xl border border-white/20 text-sm font-bold text-white hover:bg-white/5"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={onClose}
                    className="flex h-11 items-center justify-center rounded-xl bg-[#DF0112] text-sm font-bold text-white shadow-lg"
                  >
                    إنشاء حساب
                  </Link>
                </>
              )}
            </div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Array<{ slug: string; name: string; image: string; price: number; oldPrice?: number }>>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }
    if (timer.current) window.clearTimeout(timer.current);
    setLoading(true);
    timer.current = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [query, open]);

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex flex-col bg-[#07080b]/95 backdrop-blur-xl"
        >
          <div className="mx-auto w-full max-w-2xl px-4 pt-16 md:pt-24">
            <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-[#12141c] px-4 py-3.5 focus-within:ring-2 focus-within:ring-[#DF0112]/50">
              <Search className="size-5 text-[#DF0112]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query.trim()) {
                    go(`/products?q=${encodeURIComponent(query.trim())}`);
                  }
                }}
                placeholder="ابحث عن شدات ببجي، باقات، بطاقات..."
                className="flex-1 bg-transparent text-white placeholder:text-slate-500 focus:outline-none text-sm"
              />
              {loading && (
                <span className="size-4 animate-spin rounded-full border-2 border-[#DF0112] border-t-transparent" />
              )}
              <button
                onClick={onClose}
                aria-label="إغلاق"
                className="flex size-8 items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            {results.length > 0 && (
              <div className="mt-4 max-h-[55vh] overflow-y-auto rounded-2xl bg-[#12141c] border border-white/10 p-2 shadow-2xl">
                {results.map((p) => (
                  <button
                    key={p.slug}
                    onClick={() => go(`/products/${p.slug}`)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start transition hover:bg-white/5"
                  >
                    <img src={p.image} alt="" className="size-11 rounded-lg bg-white/5 object-cover" />
                    <span className="flex-1 text-sm font-bold text-slate-200">{p.name}</span>
                    <span className="text-sm font-black text-[#DF0112]">
                      {p.price} ج.م
                    </span>
                  </button>
                ))}
              </div>
            )}
            {query.trim().length >= 2 && results.length === 0 && !loading && (
              <p className="mt-6 text-center text-sm text-slate-500">
                لا توجد نتائج لـ «{query.trim()}»
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}