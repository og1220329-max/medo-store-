import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/common";

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
  description: "كيف نتعامل مع بياناتك ونحافظ على خصوصيتك في ميدو ستور.",
};

const SECTIONS: Array<{ title: string; body: string }> = [
  {
    title: "البيانات التي نجمعها",
    body: "نجمع البيانات اللازمة لإتمام طلباتك فقط: الاسم، رقم الهاتف، البريد الإلكتروني، ومعرف اللاعب عند شحن الألعاب. لا نجمع أي بيانات دفع حساسة — عمليات الدفع تتم عبر مزودي الخدمة الموثوقين.",
  },
  {
    title: "كيف نستخدم بياناتك",
    body: "نستخدم بياناتك لتنفيذ الطلبات، إرسال تحديثات حالة الطلب، تحسين الخدمة، والتواصل معك عند الحاجة (واتساب/بريد). قد نرسل إشعارات عن العروض إن كنت مشتركًا.",
  },
  {
    title: "حماية البيانات",
    body: "نشفر كلمات المرور بأحدث المعايير، ولا نشارك بياناتك مع أي طرف ثالث لأغراض تسويقية. لا نبيع بياناتك أبدًا.",
  },
  {
    title: "الإشعارات والكوكيز",
    body: "يستخدم المتجر ملفات تعريف الارتباط لحفظ جلسة الدخول وسلة التسوق. يمكنك رفضها عبر إعدادات متصفحك مع محدودية بعض الوظائف.",
  },
  {
    title: "حقوقك",
    body: "يمكنك طلب نسخة من بياناتك أو حذف حسابك بالكامل في أي وقت عبر التواصل مع الدعم، وسننفذ طلبك خلال 72 ساعة.",
  },
  {
    title: "تعديل السياسة",
    body: "قد نقوم بتحديث هذه السياسة من وقت لآخر، ويُعرض تاريخ آخر تحديث أعلى الصفحة.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-28 md:px-6 md:pt-36">
      <Breadcrumbs items={[{ label: "سياسة الخصوصية" }]} />
      <h1 className="mt-6 text-3xl font-black text-white md:text-4xl">سياسة الخصوصية</h1>
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
        أي استفسار حول بياناتك؟{" "}
        <Link href="/contact" className="font-black text-volt-400 hover:text-volt-300">
          تواصل معنا
        </Link>
      </p>
    </div>
  );
}