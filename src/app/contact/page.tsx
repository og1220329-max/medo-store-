"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { useToast } from "@/store/toast";
import { Button, Field, Input, Textarea } from "@/components/ui/primitives";
import { Breadcrumbs } from "@/components/ui/common";

const CHANNELS = [
  {
    label: "واتساب",
    value: process.env.NEXT_PUBLIC_WHATSAPP || "201000000000",
    href: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || "201000000000"}`,
    icon: MessageCircle,
    color: "from-emerald-500 to-emerald-600",
  },
  {
    label: "تيليجرام",
    value: `@${process.env.NEXT_PUBLIC_TELEGRAM || "medostore"}`,
    href: `https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM || "medostore"}`,
    icon: Send,
    color: "from-sky-500 to-cyan-600",
  },
  {
    label: "فيسبوك",
    value: "MEDO STORE",
    href: "#",
    icon: Facebook,
    color: "from-blue-500 to-blue-700",
  },
  {
    label: "إنستجرام",
    value: "@medostore",
    href: "https://instagram.com",
    icon: Instagram,
    color: "from-fuchsia-500 to-rose-500",
  },
  {
    label: "البريد",
    value: process.env.NEXT_PUBLIC_EMAIL || "support@medostore.shop",
    href: `mailto:${process.env.NEXT_PUBLIC_EMAIL || "support@medostore.shop"}`,
    icon: Mail,
    color: "from-volt-500 to-glow-500",
  },
  {
    label: "الهاتف",
    value: process.env.NEXT_PUBLIC_WHATSAPP || "+20 100 000 0000",
    href: `tel:${process.env.NEXT_PUBLIC_WHATSAPP || "201000000000"}`,
    icon: Phone,
    color: "from-amber-500 to-orange-600",
  },
];

export default function ContactPage() {
  const toast = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error("بيانات ناقصة", "جميع الحقول مطلوبة");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error("تعذر الإرسال", data.message);
        return;
      }
      toast.success("تم إرسال رسالتك", data.message);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast.error("خطأ في الاتصال", "حاول مرة أخرى");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 md:px-6 md:pt-36">
      <Breadcrumbs items={[{ label: "تواصل معنا" }]} />

      <div className="mt-5 mb-10 max-w-2xl">
        <h1 className="text-3xl font-black text-white md:text-4xl">
          تواصل معنا
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-400 md:text-base">
          فريق الدعم جاهز لخدمتك على مدار الساعة — راسلنا عبر القنوات المتاحة
          أو افتح تذكرة من النموذج وسنرد خلال دقائق.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          {CHANNELS.map((ch, i) => (
            <motion.a
              key={ch.label}
              href={ch.href}
              target={ch.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 rounded-2xl glass p-4 transition hover:border-volt-500/30"
            >
              <span
                className={`flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${ch.color} text-white shadow-lg`}
              >
                <ch.icon className="size-5.5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-black text-white">{ch.label}</span>
                <span className="block truncate text-xs text-slate-500" dir="ltr">
                  {ch.value}
                </span>
              </span>
            </motion.a>
          ))}
          <div className="flex items-center gap-3 rounded-2xl glass p-4 text-xs text-slate-500">
            <MapPin className="size-5 shrink-0 text-slate-600" />
            مصر — القاهرة — متجر رقمي بالكامل، دعم عبر الإنترنت فقط
          </div>
        </div>

        <form
          onSubmit={submit}
          className="rounded-3xl glass-strong p-6 md:p-8"
        >
          <h2 className="text-lg font-black text-white">افتح تذكرة دعم</h2>
          <p className="mt-1.5 text-xs text-slate-500">
            تصل رسالتك مباشرة لفريق الدعم وسنقوم بالرد عليك عبر البريد أو
            واتساب.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="الاسم *">
              <Input
                placeholder="اسمك الكامل"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Field>
            <Field label="البريد الإلكتروني *">
              <Input
                dir="ltr"
                type="email"
                placeholder="example@mail.com"
                className="text-left"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="الموضوع *">
                <Input
                  placeholder="مثال: استفسار عن طلب رقم MS-123456"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="الرسالة *">
                <Textarea
                  placeholder="اكتب تفاصيل استفسارك أو مشكلتك…"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </Field>
            </div>
          </div>

          <Button type="submit" size="lg" className="mt-6 w-full" loading={sending}>
            إرسال الرسالة
          </Button>
        </form>
      </div>
    </div>
  );
}