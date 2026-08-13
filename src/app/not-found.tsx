import Link from "next/link";
import { Home, Gamepad2, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-4 py-20 text-center">
      <div className="pointer-events-none absolute inset-0 bg-hero-grid opacity-60" />
      <div className="pointer-events-none absolute -top-24 start-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-volt-600/30 blur-3xl" />
      <div className="relative">
        <div className="mb-6 flex items-center justify-center gap-3 text-7xl font-black text-white md:text-8xl">
          <span className="text-gradient">4</span>
          <Gamepad2 className="size-16 text-volt-500 md:size-20" />
          <span className="text-gradient">4</span>
        </div>
        <h1 className="text-2xl font-black text-white md:text-3xl">للأسف الصفحة مش موجودة!</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-400">
          الصفحة اللي بتحاول توصّلها اتشالت أو اتنقلت. جرّب ترجع للرئيسية أو تدور على
          منتج من صفحة المتجر.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl bg-volt-600 px-6 py-3.5 text-sm font-black text-white transition hover:bg-volt-500"
          >
            <Home className="size-4" />
            العودة للرئيسية
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-black text-slate-200 transition hover:border-volt-500/50 hover:bg-volt-500/10"
          >
            <Search className="size-4" />
            تصفح المتجر
          </Link>
        </div>
      </div>
    </div>
  );
}