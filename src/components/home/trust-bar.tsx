import { CreditCard, Headset, ShieldCheck, Zap } from "lucide-react";

const ITEMS = [
  { icon: Zap, label: "شحن فوري", desc: "تنفيذ خلال دقائق" },
  { icon: ShieldCheck, label: "أمان كامل", desc: "حماية بياناتك" },
  { icon: CreditCard, label: "دفع آمن", desc: "طرق دفع متعددة" },
  { icon: Headset, label: "دعم 24/7", desc: "فريق جاهز دائمًا" },
];

export function TrustBar() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {ITEMS.map((it) => (
          <div
            key={it.label}
            className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/2 p-4"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-volt-500/10 text-volt-400">
              <it.icon className="size-5" />
            </span>
            <div>
              <p className="text-sm font-black text-white">{it.label}</p>
              <p className="mt-0.5 text-xs text-slate-500">{it.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}