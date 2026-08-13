"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import type { Category } from "@/lib/types";
import { Select } from "@/components/ui/primitives";

const SORT_OPTIONS = [
  { value: "newest", label: "الأحدث" },
  { value: "price-asc", label: "السعر: من الأقل" },
  { value: "price-desc", label: "السعر: من الأعلى" },
  { value: "rating", label: "الأعلى تقييمًا" },
  { value: "discount", label: "أكبر خصم" },
];

export function ProductFilters({
  categories,
  category,
  sort,
}: {
  categories: Category[];
  category?: string;
  sort: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const update = useCallback(
    (patch: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(patch)) {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const active = (searchParams.get("category") || "") === category;
  const hasFilters =
    searchParams.get("category") || searchParams.get("q") || searchParams.get("sort");

  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <SlidersHorizontal className="size-4 text-slate-500" />
        <button
          onClick={() => update({ category: null })}
          className={`rounded-xl px-3.5 py-2 text-sm font-bold transition ${
            !active && !searchParams.get("category")
              ? "border border-volt-500/40 bg-volt-500/15 text-white"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          الكل
        </button>
        {categories.map((c) => {
          const isActive = searchParams.get("category") === c.slug;
          return (
            <button
              key={c.id}
              onClick={() => update({ category: isActive ? null : c.slug })}
              className={`rounded-xl px-3.5 py-2 text-sm font-bold transition ${
                isActive
                  ? "border border-volt-500/40 bg-volt-500/15 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {c.name}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2.5">
        <Select
          value={searchParams.get("sort") || sort}
          onChange={(e) => update({ sort: e.target.value || null })}
          className="w-auto min-w-44"
          aria-label="ترتيب"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} className="bg-night-800">
              {o.label}
            </option>
          ))}
        </Select>
        {hasFilters && (
          <button
            onClick={() => {
              router.push(pathname, { scroll: false });
            }}
            className="flex h-11 items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 text-sm font-bold text-rose-300 transition hover:bg-rose-500/20"
          >
            <X className="size-4" />
            مسح
          </button>
        )}
      </div>
    </div>
  );
}