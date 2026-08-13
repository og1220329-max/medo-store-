"use client";

export function RevenueChart({
  days,
}: {
  days: Array<{ label: string; revenue: number; orders: number }>;
}) {
  const max = Math.max(1, ...days.map((d) => d.revenue));
  const height = 140;

  return (
    <div>
      <div className="flex items-end gap-3" style={{ height }} dir="rtl">
        {days.map((d, i) => {
          const h = Math.max(6, (d.revenue / max) * (height - 24));
          return (
            <div
              key={i}
              className="group relative flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <span className="pointer-events-none rounded-lg bg-night-950 px-1.5 py-0.5 text-[10px] font-bold text-volt-300 opacity-0 transition group-hover:opacity-100">
                {d.revenue.toLocaleString("ar-EG")}
              </span>
              <div
                className="w-full max-w-10 rounded-t-lg bg-gradient-to-t from-volt-700 to-glow-500 transition-all group-hover:from-volt-500 group-hover:to-cyber-400"
                style={{ height: h }}
              />
              <span className="text-[10px] font-semibold text-slate-500">
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}