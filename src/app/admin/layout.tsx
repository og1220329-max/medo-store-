import type { Metadata } from "next";
import { AdminGuard } from "@/components/admin/admin-layout";
import { jsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "لوحة التحكم",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd.webSite() }}
      />
      <AdminGuard>{children}</AdminGuard>
    </>
  );
}