import type { Metadata } from "next";
import { FAQSection } from "@/components/home/faq";
import { Breadcrumbs } from "@/components/ui/common";

export const metadata: Metadata = {
  title: "الأسئلة الشائعة",
  description: "إجابات عن الدفع والتنفيذ والتتبع والاسترجاع.",
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-28 md:px-6 md:pt-36">
      <Breadcrumbs items={[{ label: "الأسئلة الشائعة" }]} />
      <FAQSection />
    </div>
  );
}