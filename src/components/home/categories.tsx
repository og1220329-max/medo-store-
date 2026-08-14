"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Category } from "@/lib/types";

interface CategoryCardItem {
  id: string;
  title: string;
  image: string;
  href: string;
}

const CATEGORIES_DATA: CategoryCardItem[] = [
  {
    id: "korean-accounts",
    title: "حسابات ببجي الكوريه",
    image: "/images/cat-korean-acc.png",
    href: "/products?category=pubg-kr",
  },
  {
    id: "cheap-accounts",
    title: "حسابات رخيصة",
    image: "/images/cat-cheap-acc.png",
    href: "/products?category=pubg-services",
  },
  {
    id: "uc-we-charge",
    title: "شدات ببجي (نشحنها لك)",
    image: "/images/cat-uc-we-charge.png",
    href: "/categories/pubg-uc",
  },
  {
    id: "popularity",
    title: "دعم شعبية ببجي موبايل",
    image: "/images/cat-popularity.png",
    href: "/services/social-media",
  },
  {
    id: "uc-self",
    title: "شدات ببجي (اشحنها بنفسك)",
    image: "/images/cat-uc-self.png",
    href: "/categories/pubg-uc",
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
    <section className="w-full bg-[#08090d] py-10 md:py-14 border-b border-white/5 relative overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-black text-[#DF0112] tracking-tight">
            الأقسام :
          </h2>
          <p className="text-sm md:text-base font-bold text-white mt-1">
            استعرض جميع الاقسام في متجرنا!
          </p>
        </div>

        {/* 5 Circular Categories Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 items-start justify-center">
          {CATEGORIES_DATA.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="flex flex-col items-center text-center group"
            >
              <Link
                href={item.href}
                className="flex flex-col items-center cursor-pointer group"
              >
                {/* Circular Image Container with Glowing Hover */}
                <div className="relative size-32 sm:size-36 md:size-40 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#DF0112] shadow-[0_8px_25px_rgba(0,0,0,0.7)] group-hover:shadow-[0_0_30px_rgba(223,1,18,0.4)] transition-all duration-300 transform group-hover:scale-105 bg-[#0e1017]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                {/* Category Label Underneath */}
                <span className="mt-3.5 text-xs sm:text-sm font-black text-white group-hover:text-[#ff3a45] transition-colors duration-200 text-center leading-relaxed">
                  {item.title}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}