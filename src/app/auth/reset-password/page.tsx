import type { Metadata } from "next";
import ResetPasswordForm from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "تعيين كلمة مرور جديدة",
  description: "أدخل كلمة المرور الجديدة لحسابك في ميدو ستور.",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return <ResetPasswordForm token={token || ""} />;
}