"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const whatsappUrl = `https://api.whatsapp.com/send?phone=201202053951&text=${encodeURIComponent("مرحبًا، عندي استفسار بخصوص متجركم")}`;

  return (
    <>
      {/* Floating WhatsApp with Help Bubble */}
      <div className="fixed bottom-6 right-6 z-[999999] flex items-center gap-3 select-none">
        {/* Help Tooltip Box */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex flex-col items-end bg-[#12141c]/90 hover:bg-[#181a24] border border-white/10 px-3.5 py-2 rounded-xl text-right backdrop-blur-md shadow-2xl transition hover:border-[#25D366]/40 cursor-pointer"
        >
          <span className="text-[11px] font-bold text-white leading-tight">
            تحتاج مساعدة؟
          </span>
          <span className="text-[10px] text-emerald-400 font-medium leading-tight mt-0.5">
            تواصل معنا الآن
          </span>
        </a>

        {/* WhatsApp Circular Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="تواصل عبر واتساب"
          className="flex size-13 items-center justify-center rounded-full bg-[#25D366] hover:bg-[#20bd5a] transition-all duration-200 hover:scale-105 shadow-xl shadow-emerald-950/40 relative group"
        >
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp"
            className="size-8"
          />
        </a>
      </div>

      {/* Back to top button */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="العودة للأعلى"
        initial={false}
        animate={{
          opacity: showTop ? 1 : 0,
          y: showTop ? 0 : 16,
          pointerEvents: showTop ? "auto" : "none",
        }}
        transition={{ duration: 0.25 }}
        className={cn(
          "fixed bottom-6 left-6 z-[55] flex size-11 items-center justify-center rounded-full bg-[#12141c] border border-white/10 text-slate-300 shadow-xl transition hover:text-white hover:border-white/30"
        )}
      >
        <ArrowUp className="size-5" />
      </motion.button>
    </>
  );
}