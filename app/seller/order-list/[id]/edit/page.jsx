"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import OrderItems from "@/components/OrderItems";
import Footer from "@/components/seller/Footer";
import { useAppContext } from "@/context/AppContext";
import { getOrder, updateOrder } from "@/services/order";

const NEXT_FULFILLMENT = {
  unfulfilled: ["unfulfilled", "processing", "cancelled"],
  processing: ["processing", "shipped", "cancelled"],
  shipped: ["shipped", "delivered"],
  delivered: ["delivered"],
  cancelled: ["cancelled"],
};

export default function OrderEdit() {
  const { id } = useParams();
  const router = useRouter();
  const { currency } = useAppContext();
  const [order, setOrder] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("unpaid");
  const [fulfillmentStatus, setFulfillmentStatus] = useState("unfulfilled");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getOrder(id).then((response) => {
      if (!active) return;
      setOrder(response.data);
      setPaymentStatus(response.data.paymentStatus);
      setFulfillmentStatus(response.data.fulfillmentStatus);
    }).catch((requestError) => active && setError(requestError.message));
    return () => { active = false; };
  }, [id]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await updateOrder(id, { paymentStatus, fulfillmentStatus });
      setOrder(response.data);
      router.push(`/seller/order-list/${id}/view`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  if (!order && !error) return <Loading />;

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-between bg-gray-50">
      <main className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-10">
        <header><h1 className="text-2xl font-semibold">Fulfil order #{id}</h1><p className="text-gray-500">Fulfillment advances in order: unfulfilled → processing → shipped → delivered.</p></header>
        {error ? <p className="rounded bg-red-50 p-4 text-red-700">{error}</p> : null}
        {order ? <>
          <section className="rounded-xl border bg-white p-6"><OrderItems items={order.items} currency={currency} /></section>
          <section className="rounded-xl border bg-white p-6">
            <label htmlFor="paymentStatus" className="mb-2 block font-medium">Payment</label>
            <select id="paymentStatus" value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value)} className="w-full rounded border px-3 py-2"><option value="unpaid">Unpaid</option><option value="pending">Pending</option><option value="paid">Paid</option><option value="failed">Failed</option><option value="refunded">Refunded</option></select>
            <label htmlFor="fulfillmentStatus" className="mb-2 mt-4 block font-medium">Fulfillment</label>
            <select id="fulfillmentStatus" value={fulfillmentStatus} onChange={(event) => setFulfillmentStatus(event.target.value)} className="w-full rounded border px-3 py-2">{(NEXT_FULFILLMENT[order.fulfillmentStatus] ?? [order.fulfillmentStatus]).filter((value) => value !== "cancelled" || order.paymentStatus === "unpaid").map((value) => <option key={value} value={value} className="capitalize">{value}</option>)}</select>
            {order.paymentStatus === "unpaid" && ["unfulfilled", "processing"].includes(order.fulfillmentStatus) ? <p className="mt-2 text-sm text-gray-500">Cancelling this unpaid order returns its stock.</p> : null}
          </section>
          <div className="flex justify-end gap-2"><button onClick={() => router.back()} className="rounded border px-4 py-2">Cancel</button><button disabled={saving} onClick={handleSave} className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-60">{saving ? "Saving…" : "Save"}</button></div>
        </> : null}
      </main>
      <Footer />
    </div>
  );
}
