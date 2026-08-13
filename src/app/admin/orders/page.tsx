"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Eye, Search, XCircle } from "lucide-react";
import { useAdminFetch } from "@/components/admin/use-admin-fetch";
import { useToast } from "@/store/toast";
import { Badge, Button, Input, Select, Skeleton } from "@/components/ui/primitives";
import { Modal } from "@/components/ui/modal";
import { formatDate, formatPrice, maskPhone } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_FLOW, PAYMENT_STATUS_LABELS, PAYMENT_METHODS } from "@/lib/constants";

interface AdminOrder {
  id: string;
  number: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  customer: { name: string; phone: string; notes?: string; email?: string };
  total: number;
  subtotal: number;
  discount: number;
  couponCode?: string;
  items: Array<{ name: string; quantity: number; customData: Record<string, string> }>;
  createdAt: string;
}

const STATUS_TONE: Record<string, "emerald" | "amber" | "sky" | "rose" | "volt"> = {
  delivered: "emerald",
  created: "amber",
  paid: "sky",
  processing: "volt",
  executing: "volt",
  cancelled: "rose",
};

export default function AdminOrders() {
  const { data, loading, reload } = useAdminFetch<AdminOrder[]>("/api/admin/orders");
  const toast = useToast();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<AdminOrder | null>(null);

  const filtered = useMemo(() => {
    let list = data || [];
    const query = q.trim().toLowerCase();
    if (query) {
      list = list.filter(
        (o) =>
          o.number.toLowerCase().includes(query) ||
          o.customer.name.toLowerCase().includes(query) ||
          o.customer.phone.includes(query)
      );
    }
    if (status) list = list.filter((o) => o.status === status);
    return list;
  }, [data, q, status]);

  const action = async (id: string, act: "advance" | "cancel" | "refund") => {
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: act }),
    });
    const data2 = await res.json();
    if (!res.ok) {
      toast.error("تعذر التنفيذ", data2.message);
      return;
    }
    toast.success(
      act === "advance" ? "تم تقدم حالة الطلب" : act === "cancel" ? "تم إلغاء الطلب" : "تم استرداد المبلغ",
      `الطلب ${selected?.number || ""}`
    );
    reload();
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-black text-white md:text-3xl">الطلبات</h1>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-600" />
          <Input
            className="ps-10"
            placeholder="ابحث برقم الطلب أو اسم العميل أو الهاتف…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-auto min-w-44"
        >
          <option value="">كل الحالات</option>
          {ORDER_STATUS_FLOW.map((s) => (
            <option key={s} value={s} className="bg-night-800">
              {ORDER_STATUS_LABELS[s]}
            </option>
          ))}
          <option value="cancelled" className="bg-night-800">ملغي</option>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-white/10 py-16 text-center text-sm text-slate-500">
          لا توجد طلبات مطابقة
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => (
            <div key={o.id} className="rounded-2xl glass p-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-sm font-black text-white" dir="ltr">
                  {o.number}
                </span>
                <Badge tone={STATUS_TONE[o.status] || "volt"}>
                  {ORDER_STATUS_LABELS[o.status as keyof typeof ORDER_STATUS_LABELS] || o.status}
                </Badge>
                <span className="text-xs text-slate-500">
                  {formatDate(o.createdAt)}
                </span>
                <span className="ms-auto text-lg font-black text-gradient">
                  {formatPrice(o.total)}
                </span>
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-400">
                <span>{o.customer.name} — {maskPhone(o.customer.phone)}</span>
                <span>{o.items.length} منتج</span>
                <span>
                  الدفع:{" "}
                  {PAYMENT_METHODS[o.paymentMethod]?.name || o.paymentMethod} •{" "}
                  <span className={o.paymentStatus === "paid" ? "font-bold text-emerald-400" : "font-bold text-amber-400"}>
                    {PAYMENT_STATUS_LABELS[o.paymentStatus as keyof typeof PAYMENT_STATUS_LABELS] || o.paymentStatus}
                  </span>
                </span>
                {o.discount > 0 && <span className="text-emerald-400">خصم {formatPrice(o.discount)}</span>}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Button size="sm" variant="glass" onClick={() => setSelected(o)}>
                  <Eye className="size-3.5" />
                  التفاصيل
                </Button>
                <Button size="sm" onClick={() => action(o.id, "advance")} disabled={o.status === "delivered" || o.status === "cancelled"}>
                  تقدم الحالة
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => action(o.id, "cancel")}
                  disabled={o.status === "delivered" || o.status === "cancelled"}
                >
                  <XCircle className="size-3.5" />
                  إلغاء
                </Button>
                {o.paymentStatus === "paid" && (
                  <Button size="sm" variant="outline" onClick={() => action(o.id, "refund")}>
                    استرداد
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <OrderDetailsModal
        order={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

function OrderDetailsModal({
  order,
  onClose,
}: {
  order: AdminOrder | null;
  onClose: () => void;
}) {

  return (
    <Modal open={!!order} onClose={onClose} className="sm:max-w-2xl" labelledBy="order-title">
      {order && (
        <div className="p-6">
          <h3 id="order-title" className="text-lg font-black text-white" dir="ltr">
            {order.number}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {formatDate(order.createdAt)} — {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS]}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl glass p-4">
              <p className="mb-1.5 text-xs font-bold text-slate-500">بيانات العميل</p>
              <p className="text-sm font-bold text-white">{order.customer.name}</p>
              <p className="text-xs text-slate-400" dir="ltr">{order.customer.phone}</p>
              {order.customer.email && (
                <p className="mt-1 text-xs text-slate-500" dir="ltr">{order.customer.email}</p>
              )}
              {order.customer.notes && (
                <p className="mt-1.5 text-xs text-slate-400">{order.customer.notes}</p>
              )}
            </div>
            <div className="rounded-2xl glass p-4">
              <p className="mb-1.5 text-xs font-bold text-slate-500">الدفع</p>
              <p className="text-sm font-bold text-white">
                {PAYMENT_METHODS[order.paymentMethod]?.name || order.paymentMethod}
              </p>
              <p className={`text-xs font-bold ${order.paymentStatus === "paid" ? "text-emerald-400" : "text-amber-400"}`}>
                {PAYMENT_STATUS_LABELS[order.paymentStatus as keyof typeof PAYMENT_STATUS_LABELS]}
              </p>
              {order.couponCode && (
                <p className="mt-1 text-xs text-emerald-400">كوبون: {order.couponCode}</p>
              )}
            </div>
          </div>

          <div className="mt-4 rounded-2xl glass p-4">
            <p className="mb-3 text-xs font-bold text-slate-500">المنتجات ({order.items.length})</p>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-white">
                      {item.name} <span className="text-slate-500">× {item.quantity}</span>
                    </span>
                  </div>
                  {Object.keys(item.customData).length > 0 && (
                    <p className="mt-1 text-[11px] leading-5 text-sky-400">
                      {Object.entries(item.customData).map(([k, v]) => `${k}: ${v}`).join(" • ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/8 bg-white/4 p-4">
            <div className="text-sm text-slate-400">
              <p>الإجمالي الفرعي: <span className="font-bold text-slate-200">{formatPrice(order.subtotal)}</span></p>
              <p className="text-emerald-400">الخصم: -{formatPrice(order.discount)}</p>
            </div>
            <p className="text-xl font-black text-gradient">{formatPrice(order.total)}</p>
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="size-4 text-emerald-400" />
            تحديث الحالة يتم من بطاقة الطلب في قائمة الطلبات
          </div>
        </div>
      )}
    </Modal>
  );
}