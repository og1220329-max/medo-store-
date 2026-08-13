"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Instagram, MessageCircle, Music2, UserPlus, Youtube } from "lucide-react";
import { SOCIAL_SERVICES } from "@/lib/constants";
import { formatNumber } from "@/lib/utils";
import { Button, Badge } from "@/components/ui/primitives";

const PLATFORM_STYLES: Record<string, { icon: typeof Instagram; color: string }> = {
  instagram: {
    icon: Instagram,
    color: "bg-gradient-to-br from-fuchsia-500 via-rose-500 to-amber-500",
  },
  tiktok: { icon: Music2, color: "bg-gradient-to-br from-slate-100 to-night-700 border border-white/20" },
  youtube: { icon: Youtube, color: "bg-gradient-to-br from-rose-600 to-rose-700" },
};

export function SocialMediaCalculator() {
  const [selectedId, setSelectedId] = useState(SOCIAL_SERVICES[0].id);
  const [quantity, setQuantity] = useState(1);

  const selected = SOCIAL_SERVICES.find((s) => s.id === selectedId)!;
  const total = selected.minPrice * quantity * 10 % 10 === 0
    ? selected.minPrice * quantity
    : selected.minPrice * quantity;

  const whatsappMessage = useMemo(
    () =>
      `مرحبًا، أريد طلب: ${selected.service} (${formatNumber(quantity * 100)} وحدة)\nالإجمالي التقريبي: ${total} ج.م`,
    [selected, quantity, total]
  );

  return (
    <div className="mt-16" id="calculator">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white md:text-2xl">
            احسب طلبك بنفسك
          </h2>
          <p className="mt-1.5 text-sm text-slate-400">
            اختر الخدمة والكمية واحصل على سعر فوري، ثم أرسل طلبك عبر واتساب.
          </p>
        </div>
        <Badge tone="emerald" className="hidden sm:inline-flex">
          تنفيذ خلال {selected.delivery}
        </Badge>
      </div>

      <div className="rounded-[2rem] glass-strong p-6 md:p-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SOCIAL_SERVICES.map((s) => {
            const style = PLATFORM_STYLES[s.platform];
            const Icon = style.icon;
            const active = s.id === selectedId;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                className={`flex items-center gap-3 rounded-2xl border p-4 text-start transition-all ${
                  active
                    ? "border-volt-500/50 bg-volt-500/10 shadow-glow"
                    : "border-white/8 bg-white/3 hover:border-white/20"
                }`}
              >
                <span
                  className={`flex size-11 shrink-0 items-center justify-center rounded-xl text-white ${style.color}`}
                >
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-black text-white">
                    {s.service}
                  </span>
                  <span className="block truncate text-[11px] text-slate-500">
                    {s.description}
                  </span>
                </span>
                {s.badge && (
                  <Badge tone="amber" className="hidden lg:inline-flex">
                    {s.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid items-center gap-6 rounded-2xl border border-white/8 bg-white/3 p-5 md:grid-cols-[1fr_auto] md:p-6">
          <div>
            <p className="text-sm font-bold text-slate-300">{selected.service}</p>
            <p className="mt-0.5 text-xs text-slate-500">
              سعر المئة وحدة: {selected.minPrice} ج.م — مدة التنفيذ: {selected.delivery}
            </p>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-night-800 p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex size-8 items-center justify-center rounded-lg text-slate-300 hover:text-white"
                  aria-label="إنقاص"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-black">
                  {formatNumber(quantity)}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(200, q + 1))}
                  className="flex size-8 items-center justify-center rounded-lg text-slate-300 hover:text-white"
                  aria-label="زيادة"
                >
                  +
                </button>
              </div>
              <div>
                <p className="text-[11px] text-slate-500">إجمالي الوحدات</p>
                <p className="text-sm font-black text-white">
                  {formatNumber(quantity * 100)} وحدة
                </p>
              </div>
              <motion.div
                key={total}
                initial={{ scale: 0.94, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className="ms-auto text-end"
              >
                <p className="text-[11px] text-slate-500">السعر التقديري</p>
                <p className="text-xl font-black text-gradient">
                  {formatNumber(total)} ج.م
                </p>
              </motion.div>
            </div>
          </div>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || "201000000000"}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" className="w-full md:w-auto">
              <MessageCircle className="size-5" />
              اطلب عبر واتساب
            </Button>
          </a>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <UserPlus className="size-3.5 text-emerald-400" />
            بدون كلمة مرور
          </span>
          <span className="flex items-center gap-1.5">
            <UserPlus className="size-3.5 text-sky-400" />
            تنفيذ تدريجي آمن
          </span>
          <span className="flex items-center gap-1.5">
            <UserPlus className="size-3.5 text-amber-400" />
            دعم فني حتى الاكتمال
          </span>
        </div>
      </div>
    </div>
  );
}