"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function CountdownTimer({
  endsAt,
  compact = false,
  className,
}: {
  endsAt: string;
  compact?: boolean;
  className?: string;
}) {
  const [left, setLeft] = useState(0);

  useEffect(() => {
    const target = new Date(endsAt).getTime();
    const tick = () => setLeft(Math.max(0, target - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  const total = Math.floor(left / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");

  const cells = compact
    ? [
        { value: pad(hours), label: "ساعة" },
        { value: pad(minutes), label: "دقيقة" },
        { value: pad(seconds), label: "ثانية" },
      ]
    : [
        { value: pad(days), label: "يوم" },
        { value: pad(hours), label: "ساعة" },
        { value: pad(minutes), label: "دقيقة" },
        { value: pad(seconds), label: "ثانية" },
      ];

  if (left <= 0) {
    return (
      <div className={cn("font-bold text-rose-400", className)}>انتهى العرض</div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)} dir="ltr">
      {cells.map((cell, i) => (
        <div key={cell.label} className="flex items-center gap-1.5" dir="ltr">
          {i > 0 && <span className="pb-1 font-black text-volt-400">:</span>}
          <div className="flex flex-col items-center">
            <motion.span
              key={cell.value}
              initial={{ opacity: 0.4, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex items-center justify-center rounded-xl font-mono font-black text-white",
                compact
                  ? "size-9 bg-white/8 text-sm"
                  : "size-12 bg-white/8 text-lg md:size-14 md:text-xl"
              )}
            >
              {cell.value}
            </motion.span>
            <span className="mt-1 text-[10px] font-semibold text-slate-500">
              {cell.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}