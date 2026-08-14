"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Category } from "@/lib/types";

interface CategoryCardItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
}

const DEFAULT_FEATURED_CATEGORIES: CategoryCardItem[] = [
  {
    id: "pubg-uc",
    title: "شدات ببجي",
    subtitle: "جميع فئات الشدات",
    image: "/images/cat-uc-3d.jpg",
    href: "/categories/pubg-uc",
  },
  {
    id: "pubg-bundles",
    title: "باقات ببجي",
    subtitle: "باقات مميزة بأسعار أقل",
    image: "/images/cat-crate-3d.jpg",
    href: "/categories/bundles",
  },
  {
    id: "pubg-services",
    title: "خدمات ببجي",
    subtitle: "رفع تقييم - تغيير إسم وغيرها",
    image: "/images/cat-helmet-3d.jpg",
    href: "/categories/pubg-services",
  },
  {
    id: "social-media",
    title: "خدمات السوشيال",
    subtitle: "متابعين ولايكات ومشاهدات",
    image: "/images/cat-social-3d.jpg",
    href: "/services/social-media",
  },
  {
    id: "digital-cards",
    title: "منتجات رقمية",
    subtitle: "بطاقات شحن وألعاب أخرى",
    image: "/images/cat-giftcards-3d.jpg",
    href: "/categories/digital",
  },
];

export function Categories({
  categories,
  socialCategory,
}: {
  categories?: Category[];
  socialCategory?: Category | undefined;
}) {
  return (
    <section className="w-full bg-[#08090d] py-6 md:py-8 border-b border-white/5">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        {/* 5-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {DEFAULT_FEATURED_CATEGORIES.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <Link
                href={item.href}
                className="group flex items-center justify-between rounded-xl bg-[#0e1017] hover:bg-[#141722] border border-white/8 hover:border-[#DF0112]/40 p-3.5 transition-all duration-300 shadow-md h-full"
              >
                {/* 3D Asset Image */}
                <div className="relative size-16 shrink-0 rounded-lg overflow-hidden bg-black/40 border border-white/5 flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="size-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>

                {/* Card Text & CTA */}
                <div className="flex flex-col items-end text-right flex-1 pr-3">
                  <h3 className="text-sm font-black text-white group-hover:text-white transition">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {item.subtitle}
                  </p>
                  
                  <span className="mt-2.5 inline-flex items-center justify-center rounded-md bg-[#161822] group-hover:bg-[#DF0112] px-3 py-1 text-[11px] font-bold text-slate-200 group-hover:text-white border border-white/5 group-hover:border-transparent transition-colors duration-200">
                    تسوق الآن
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}