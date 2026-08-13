import type { Metadata } from "next";
import { AccountGuard } from "@/components/account/account-guard";
import { AccountNav } from "@/components/account/account-nav";

export const metadata: Metadata = {
  title: "حسابي",
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <AccountGuard>
      <div className="mx-auto max-w-5xl px-4 pb-24 pt-28 md:px-6 md:pt-36">
        <AccountNav />
        {children}
      </div>
    </AccountGuard>
  );
}