import type { Metadata } from "next";
import AuthPage from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
  description: "سجّل الدخول إلى حسابك في ميدو ستور.",
};

export default function LoginPage() {
  return <AuthPage mode="login" />;
}