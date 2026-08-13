import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/common";

export const metadata: Metadata = {
  title: "الشروط والأحكام",
  description: "شروط استخدام متجر ميدو ستور للخدمات الرقمية وشحن الألعاب.",
};

const SECTIONS: Array<{ title: string; body: string }> = [
  {
    title: "قبول الشروط",
    body: "بإتمام أي طلب في MEDO STORE فأنت توافق على هذه الشروط والأحكام. يرجى قراءتها بعناية قبل الشراء، وتواصل معنا عبر واتساب لأي استفسار.",
  },
  {
    title: "الخدمات والمنتجات",
    body: "جميع منتجاتنا رقمية: شدات ببجي موبايل والكورية، خدمات السوشيال ميديا، بطاقات وباقات رقمية. تُنفذ الطلبات خلال دقائق إلى ساعات حسب نوع الخدمة وترتيب الطلبات.",
  },
  {
    title: "الدفع",
    body: "يدعم المتجر عدة وسائل دفع: فوري، فودافون كاش، إنستاباي، تحويل بنكي، والبطاقات المصرفية. تُأكّد الطلبات بعد إتمام الدفع مباشرة وتبدأ عملية التنفيذ.",
  },
  {
    title: "التنفيذ والتسليم",
    body: "تُرسل تفاصيل التنفيذ (شاشة الشحن أو بيانات الخدمة) عبر واتساب والبريد. في حال طلبت خدمة تحتاج بيانات داخل اللعبة، تأكد من إدخال معرف اللاعب والسيرفر بدقة — المتجر غير مسؤول عن بيانات خاطئة.",
  },
  {
    title: "الإلغاء والاسترجاع",
    body: "نظرًا لطبيعة المنتجات الرقمية الفورية، لا يمكن إلغاء الطلبات بعد بدء التنفيذ. إذا لم يُنفّذ طلبك خلال المدة المعلنة، تواصل مع الدعم وسنعيد المبلغ كاملًا أو ننفذ طلبك فورًا.",
  },
  {
    title: "مسؤولية العميل",
    body: "أنت مسؤول عن صحة البيانات المُدخلة (معرف اللاعب، السيرفر، البريد، رقم الهاتف) وعن الحفاظ على أمان معلوماتك، وعن الاستخدام المناسب للخدمات المشتراة دون مخالفة شروط اللعبة.",
  },
  {
    title: "تعديل الشروط",
    body: "قد يعدّل المتجر هذه الشروط في أي وقت، ويُعدّ استمرارك في استخدام المتجر بعد التعديل قبولًا للشروط المحدثة.",
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-28 md:px-6 md:pt-36">
      <Breadcrumbs items={[{ label: "الشروط والأحكام" }]} />
      <h1 className="mt-6 text-3xl font-black text-white md:text-4xl">الشروط والأحكام</h1>
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
        لديك سؤال؟{" "}
        <Link href="/contact" className="font-black text-volt-400 hover:text-volt-300">
          تواصل معنا
        </Link>
      </p>
    </div>
  );
}