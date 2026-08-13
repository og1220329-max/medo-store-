import type { Metadata } from "next";
import AuthPage from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "استعادة كلمة المرور",
  description: "استعد كلمة مرور حسابك في ميدو ستور.",
};

export default function ForgotPage() {
  return <AuthPage mode="forgot" />;
}