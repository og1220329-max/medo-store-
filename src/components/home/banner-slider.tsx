"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Banner } from "@/lib/types";

export function BannerSlider() {
  const [banners, setBanners] = useState<Banner[] | null>(null);
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch("/api/banners", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setBanners(d))
      .catch(() => {});
  }, []);

  const count = banners?.length || 0;

  useEffect(() => {
    if (count <= 1) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % count), 5000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [count]);

  if (!banners || count === 0) return null;

  const go = (dir: number) => setIndex((i) => (i + dir + count) % count);

  return (
    <div className="relative mx-auto max-w-7xl px-4 pb-2 md:px-6">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-night-900">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(${-index * 100}%)` }}
        >
          {banners.map((b) => (
            <div key={b.id} className="w-full shrink-0">
              <div className="relative flex min-h-64 items-center overflow-hidden md:min-h-80">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-night-950 via-night-950/85 to-transparent" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.image}
                  alt={b.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-80"
                />
                <div className="relative z-10 max-w-xl p-8 md:p-14">
                  <h2 className="text-3xl font-black text-white md:text-5xl leading-tight">
                    {b.title}
                  </h2>
                  {b.subtitle && (
                    <p className="mt-3 text-sm text-slate-300 md:text-base">{b.subtitle}</p>
                  )}
                  {b.buttonText && b.buttonUrl && (
                    <Link
                      href={b.buttonUrl}
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-volt-600 to-glow-600 px-6 py-3 text-sm font-black text-white shadow-glow transition hover:brightness-110"
                    >
                      {b.buttonText}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="السابق"
              className="absolute start-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
            >
              <ChevronRight className="size-5" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="التالي"
              className="absolute end-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
            >
              <ChevronLeft className="size-5" />
            </button>
            <div className="absolute bottom-4 start-1/2 flex -translate-x-1/2 gap-2">
              {banners.map((b, i) => (
                <button
                  key={b.id}
                  onClick={() => setIndex(i)}
                  aria-label={`شريحة ${i + 1}`}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === index ? "w-8 bg-volt-500" : "w-2 bg-white/25 hover:bg-white/50"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}