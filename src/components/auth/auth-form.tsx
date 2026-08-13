"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Gem, Lock, Mail, Package, User } from "lucide-react";
import { useToast } from "@/store/toast";
import { Button, Field, Input } from "@/components/ui/primitives";

type Mode = "login" | "register" | "forgot";

const COPY: Record<
  Mode,
  { title: string; subtitle: string; submit: string; alt: { label: string; action: string; href: string } }
> = {
  login: {
    title: "تسجيل الدخول",
    subtitle: "أهلاً بعودتك — تابع طلباتك واشحن بشكل أسرع.",
    submit: "دخول",
    alt: { label: "ليس لديك حساب؟", action: "أنشئ حسابًا", href: "/auth/register" },
  },
  register: {
    title: "إنشاء حساب",
    subtitle: "حساب واحد لكل طلباتك وتتبعها وإعادة الشراء بسرعة.",
    submit: "إنشاء حساب",
    alt: { label: "لديك حساب بالفعل؟", action: "سجّل الدخول", href: "/auth/login" },
  },
  forgot: {
    title: "استعادة كلمة المرور",
    subtitle: "أدخل بريدك وسنرسل لك تعليمات الاستعادة.",
    submit: "إرسال التعليمات",
    alt: { label: "تذكرت كلمة المرور؟", action: "سجّل الدخول", href: "/auth/login" },
  },
};

export default function AuthPage({ mode }: { mode: Mode }) {
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [devLink, setDevLink] = useState<string | null>(null);
  const copy = COPY[mode];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error("تعذر إنشاء الحساب", data.message);
          return;
        }
        // تسجيل دخول تلقائي
        const loginRes = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });
        if (loginRes.ok) {
          toast.success("تم إنشاء الحساب", "أهلاً بك في MEDO STORE 🎉");
          router.push("/");
          router.refresh();
          return;
        }
        toast.success("تم إنشاء الحساب", "سجّل الدخول الآن");
        router.push("/auth/login");
      } else if (mode === "login") {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error("فشل الدخول", data.message);
          return;
        }
        toast.success("تم تسجيل الدخول", `أهلاً ${data.user.name} 👋`);
        router.push(data.user.role === "admin" ? "/admin" : "/");
        router.refresh();
      } else {
        const res = await fetch("/api/auth/reset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email }),
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error("تعذر إرسال الطلب", data.message);
          return;
        }
        toast.info("تم الاستلام", data.message);
        setForm((f) => ({ ...f, email: "" }));
        if (data.devResetToken) {
          setDevLink(`/auth/reset-password?token=${encodeURIComponent(data.devResetToken)}`);
        }
      }
    } catch {
      toast.error("خطأ في الاتصال", "حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-16 pt-28">
      <div className="pointer-events-none absolute start-1/2 top-10 size-96 -translate-x-1/2 rounded-full bg-volt-600/15 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 end-10 size-60 rounded-full bg-glow-600/10 blur-[110px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="mb-7 flex items-center justify-center gap-2.5">
          <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-volt-600 to-glow-600 shadow-glow">
            <Package className="size-5.5 text-white" />
          </span>
          <span className="text-xl font-black text-white">
            MEDO <span className="text-gradient">STORE</span>
          </span>
        </div>

        <form
          onSubmit={submit}
          className="rounded-[2rem] glass-strong p-7 shadow-2xl md:p-9"
        >
          <h1 className="text-2xl font-black text-white">{copy.title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">{copy.subtitle}</p>

          <div className="mt-7 space-y-4">
            {mode === "register" && (
              <Field label="الاسم الكامل *">
                <div className="relative">
                  <User className="absolute start-3.5 top-1/2 size-4.5 -translate-y-1/2 text-slate-600" />
                  <Input
                    className="ps-10"
                    placeholder="مثال: أحمد محمود"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
              </Field>
            )}

            <Field label="البريد الإلكتروني *">
              <div className="relative">
                <Mail className="absolute start-3.5 top-1/2 size-4.5 -translate-y-1/2 text-slate-600" />
                <Input
                  dir="ltr"
                  type="email"
                  className="ps-10 text-left"
                  placeholder="example@mail.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </Field>

            {mode === "register" && (
              <Field label="رقم الهاتف (اختياري)">
                <Input
                  dir="ltr"
                  inputMode="tel"
                  className="text-left"
                  placeholder="01012345678"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </Field>
            )}

            {mode !== "forgot" && (
              <Field
                label="كلمة المرور *"
                hint={mode === "register" ? "8 أحرف على الأقل" : undefined}
              >
                <div className="relative">
                  <Lock className="absolute start-3.5 top-1/2 size-4.5 -translate-y-1/2 text-slate-600" />
                  <Input
                    dir="ltr"
                    type={showPass ? "text" : "password"}
                    className="ps-10 pe-10 text-left"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    aria-label={showPass ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPass ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
                  </button>
                </div>
              </Field>
            )}

            {mode === "login" && (
              <Link
                href="/auth/forgot"
                className="block text-end text-xs font-bold text-volt-400 hover:text-volt-300"
              >
                نسيت كلمة المرور؟
              </Link>
            )}
          </div>

          {mode === "forgot" && devLink && (
            <p className="mt-4 rounded-xl border border-volt-500/25 bg-volt-500/8 p-3.5 text-xs text-slate-300">
              وضع تجريبي: اضغط{" "}
              <Link href={devLink} className="font-black text-volt-300 underline">
                هنا
              </Link>{" "}
              لإكمال استعادة كلمة المرور مباشرة.
            </p>
          )}

          <Button type="submit" size="lg" className="mt-7 w-full" loading={loading}>
            {copy.submit}
          </Button>

          <p className="mt-5 text-center text-sm text-slate-500">
            {copy.alt.label}{" "}
            <Link href={copy.alt.href} className="font-black text-volt-400 hover:text-volt-300">
              {copy.alt.action}
            </Link>
          </p>
        </form>

        <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-slate-600">
          <Gem className="size-3.5 text-volt-500/60" />
          بياناتك مشفرة ومحمية — لا نشاركها مع أي طرف ثالث
        </div>
      </motion.div>
    </div>
  );
}