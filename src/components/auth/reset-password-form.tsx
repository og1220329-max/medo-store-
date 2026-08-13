"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { KeyRound, Package } from "lucide-react";
import { useToast } from "@/store/toast";
import { Button, Field, Input } from "@/components/ui/primitives";

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const toast = useToast();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("كلمتا المرور غير متطابقتين");
      return;
    }
    if (password.length < 8) {
      toast.error("كلمة المرور 8 أحرف على الأقل");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error("تعذر تغيير كلمة المرور", data.message);
        return;
      }
      toast.success("تم تغيير كلمة المرور", "سجّل دخولك بكلمة المرور الجديدة");
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-16 pt-28">
      <div className="pointer-events-none absolute start-1/2 top-10 size-96 -translate-x-1/2 rounded-full bg-volt-600/15 blur-[130px]" />
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

        <form onSubmit={submit} className="rounded-[2rem] glass-strong p-7 shadow-2xl md:p-9">
          <h1 className="text-2xl font-black text-white">تعيين كلمة مرور جديدة</h1>
          <p className="mt-2 text-sm text-slate-400">
            أدخل كلمة مرور جديدة لحسابك — 8 أحرف على الأقل.
          </p>

          {!token ? (
            <p className="mt-6 rounded-xl border border-rose-500/25 bg-rose-500/8 p-4 text-sm text-rose-300">
              رابط غير صالح — اطلب رابط استعادة جديد من{" "}
              <Link href="/auth/forgot" className="font-black underline">
                صفحة الاستعادة
              </Link>
              .
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              <Field label="كلمة المرور الجديدة *" hint="8 أحرف على الأقل">
                <div className="relative">
                  <KeyRound className="absolute start-3.5 top-1/2 size-4.5 -translate-y-1/2 text-slate-600" />
                  <Input
                    dir="ltr"
                    type="password"
                    className="ps-10 text-left"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </Field>
              <Field label="تأكيد كلمة المرور *">
                <div className="relative">
                  <KeyRound className="absolute start-3.5 top-1/2 size-4.5 -translate-y-1/2 text-slate-600" />
                  <Input
                    dir="ltr"
                    type="password"
                    className="ps-10 text-left"
                    placeholder="••••••••"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                </div>
              </Field>
              <Button type="submit" size="lg" className="w-full" loading={loading}>
                تغيير كلمة المرور
              </Button>
            </div>
          )}

          <p className="mt-5 text-center text-sm text-slate-500">
            تذكرت كلمة المرور؟{" "}
            <Link href="/auth/login" className="font-black text-volt-400 hover:text-volt-300">
              سجّل الدخول
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}