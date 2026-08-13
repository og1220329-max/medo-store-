import type { Metadata } from "next";
import AuthPage from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "إنشاء حساب",
  description: "أنشئ حسابًا جديدًا في ميدو ستور.",
};

export default function RegisterPage() {
  return <AuthPage mode="register" />;
}