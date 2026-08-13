"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import type { Review } from "@/lib/types";
import { SectionHeading } from "@/components/ui/common";
import { StarRating } from "@/components/ui/common";

export function Reviews({ reviews }: { reviews: Review[] }) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  const go = (next: number) => {
    setIndex((next + reviews.length) % reviews.length);
  };

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % reviews.length);
    }, 6000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [reviews.length]);

  const resetTimer = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % reviews.length);
    }, 6000);
  };

  const visible =
    reviews.length <= 3
      ? reviews
      : [0, 1, 2].map((off) => reviews[(index + off) % reviews.length]);

  return (
    <section className="relative overflow-hidden py-16 md:py-20">
      <div className="pointer-events-none absolute start-1/4 top-0 size-64 rounded-full bg-volt-600/10 blur-[110px]" />
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          center
          eyebrow="آراء العملاء"
          title="ماذا يقول عملاؤنا؟"
          subtitle="أكثر من 15,000 طلب ناجح وثقة آلاف العملاء — هذه بعض تجاربهم."
        />

        <div className="relative mx-auto grid max-w-5xl gap-5 md:grid-cols-3 md:gap-6">
          {visible.map((review, i) => (
            <motion.div
              key={`${review.id}-${index}`}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`relative flex flex-col rounded-3xl glass p-6 ${
                i === 1 && reviews.length > 3 ? "hidden md:flex" : ""
              } ${i === 2 && reviews.length > 3 ? "hidden md:flex" : ""}`}
            >
              <Quote className="absolute -top-3 start-6 size-9 rounded-xl bg-gradient-to-br from-volt-600 to-glow-600 p-2 text-white shadow-glow" />
              <StarRating rating={review.rating} className="mb-4 mt-1.5" />
              <p className="flex-1 text-sm leading-7 text-slate-300">
                «{review.text}»
              </p>
              <div className="mt-5 flex items-center gap-3 border-t border-white/8 pt-4">
                <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-volt-500/40 to-glow-500/40 text-sm font-black text-white">
                  {review.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-white">
                    {review.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {review.product || "عميل موثوق"}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => {
              go(index - 1);
              resetTimer();
            }}
            aria-label="السابق"
            className="flex size-10 items-center justify-center rounded-xl glass text-slate-300 transition hover:border-volt-500/40 hover:text-white"
          >
            <ChevronRight className="size-5" />
          </button>
          <div className="flex items-center gap-1.5" dir="ltr">
            {reviews.map((r, i) => (
              <button
                key={r.id}
                onClick={() => {
                  setIndex(i);
                  resetTimer();
                }}
                aria-label={`التقييم ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-7 bg-volt-500" : "w-2.5 bg-white/15 hover:bg-white/30"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => {
              go(index + 1);
              resetTimer();
            }}
            aria-label="التالي"
            className="flex size-10 items-center justify-center rounded-xl glass text-slate-300 transition hover:border-volt-500/40 hover:text-white"
          >
            <ChevronLeft className="size-5" />
          </button>
        </div>
      </div>
    </section>
  );
}