import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/common";

export const metadata: Metadata = {
  title: "سياسة الاسترجاع",
  description: "سياسة الإلغاء والاسترجاع في متجر ميدو ستور للمنتجات الرقمية.",
};

const SECTIONS: Array<{ title: string; body: string }> = [
  {
    title: "طبيعة المنتجات الرقمية",
    body: "جميع منتجاتنا رقمية تُنفّذ فورًا بعد الدفع (شحن شدات، خدمات سوشيال ميديا، بطاقات). بمجرد بدء التنفيذ لا يمكن إلغاء الطلب أو استرجاع المبلغ لأن الخدمة وُصّلت بالفعل.",
  },
  {
    title: "عدم التنفيذ خلال المدة المعلنة",
    body: "إذا لم يُنفّذ طلبك خلال المدة المعلنة على صفحة المنتج، تواصل معنا وسنعيد لك المبلغ كاملًا خلال 24 ساعة أو ننفذ طلبك فورًا — الخيار لك.",
  },
  {
    title: "بيانات خاطئة من العميل",
    body: "إذا أدخلت معرف لاعب أو سيرفر خاطئًا وتم التنفيذ بناءً عليه، لا يمكن استرجاع المبلغ. تواصل معنا فورًا قبل التنفيذ لتصحيح البيانات.",
  },
  {
    title: "مشكلة في التنفيذ",
    body: "إذا لم تصلك الشدات أو الخدمة رغم تأكيد الدفع، أرسل لنا رقم الطلب وسجل التنفيذ (لقطة شاشة)، سنراجع الحالة ونعيد التنفيذ أو نسترد المبلغ في أسرع وقت.",
  },
  {
    title: "كيفية طلب الاسترجاع",
    body: "تواصل مع الدعم عبر واتساب أو صفحة تواصل معنا، وأرفق رقم الطلب وأسباب الطلب. فترة معالجة طلبات الاسترجاع من 24 إلى 72 ساعة.",
  },
];

export default function RefundPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-28 md:px-6 md:pt-36">
      <Breadcrumbs items={[{ label: "سياسة الاسترجاع" }]} />
      <h1 className="mt-6 text-3xl font-black text-white md:text-4xl">سياسة الإلغاء والاسترجاع</h1>
      <p className="mt-3 text-sm text-slate-400">آخر تحديث: يناير 2026</p>
      <div className="mt-8 space-y-6">
        {SECTIONS.map((s, i) => (
          <section key={i} className="rounded-3xl glass p-6">
            <h2 className="text-lg font-black text-white">{s.title}</h2>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-300">{s.body}</p>
          </section>
        ))}
      </div>
      <p className="mt-8 text-center text-sm text-slate-500">
        لديك استفسار عن طلب؟{" "}
        <Link href="/contact" className="font-black text-volt-400 hover:text-volt-300">
          تواصل معنا
        </Link>
      </p>
    </div>
  );
}