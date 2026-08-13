import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = await getStore();
  return NextResponse.json({
    settings: {
      storeName: store.settings.storeName,
      tagline: store.settings.tagline,
      currency: store.settings.currency,
      announcement: store.settings.announcement,
      offerEndsAt: store.settings.offerEndsAt,
      paymentMethods: store.settings.paymentMethods,
      whatsapp: store.settings.whatsapp,
      telegram: store.settings.telegram,
      facebook: store.settings.facebook,
      instagram: store.settings.instagram,
      email: store.settings.email,
      phone: store.settings.phone,
      deliveryNote: store.settings.deliveryNote,
    },
  });
}