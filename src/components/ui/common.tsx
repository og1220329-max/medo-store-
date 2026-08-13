"use client";

import Link from "next/link";
import { ChevronLeft, Home, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="مسار التنقل" className="flex items-center gap-1.5 text-xs">
      <Link
        href="/"
        className="flex items-center gap-1 text-slate-500 transition hover:text-volt-300 focus-ring rounded-md"
      >
        <Home className="size-3.5" />
        الرئيسية
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronLeft className="size-3.5 text-slate-600" />
          {item.href ? (
            <Link
              href={item.href}
              className="text-slate-500 transition hover:text-volt-300"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-slate-300">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function StarRating({
  rating,
  size = "size-4",
  className,
}: {
  rating: number;
  size?: string;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} dir="ltr">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            size,
            i <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-700 text-slate-700"
          )}
        />
      ))}
      <span className="mr-1.5 text-xs font-bold text-slate-400">
        {rating.toFixed(1)}
      </span>
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = false,
  action,
}: {
  eyebrow?: React.ReactNode;
  title: string;
  subtitle?: string;
  center?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={cn("mb-10 flex items-end justify-between gap-6", center && "flex-col items-center text-center")}
    >
      <div className={cn("max-w-2xl", center && "flex flex-col items-center")}>
        {eyebrow && (
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-volt-500/30 bg-volt-500/10 px-3.5 py-1 text-xs font-bold text-volt-300">
            {eyebrow}
          </span>
        )}
        <h2 className="text-2xl font-black text-white md:text-4xl">{title}</h2>
        {subtitle && (
          <p className="mt-3 text-sm leading-7 text-slate-400 md:text-base">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}