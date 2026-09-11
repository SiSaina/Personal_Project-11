"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import OrderItems from "@/components/OrderItems";
import Footer from "@/components/seller/Footer";
import { useAppContext } from "@/context/AppContext";
import { getOrder, updateOrder } from "@/services/order";
import { downloadOrderDocument, fulfillItem, processReturn, updateShipment } from "@/services/shopping";

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
          <section className="rounded-xl border bg-white p-6"><h2 className="font-semibold">Partial fulfillment</h2><div className="mt-3 space-y-2">{order.items.map(item=><div key={item.id} className="flex items-center justify-between gap-3"><span>{item.productName}: {item.fulfilledQuantity}/{item.quantity}</span>{item.fulfilledQuantity<item.quantity?<button onClick={()=>fulfillItem(id,{orderItemId:item.id,quantity:1,employeeNote:prompt("Internal order note (optional)",order.employeeNote??"")||null}).then(r=>setOrder(r.data))} className="rounded border px-2 py-1">Fulfill one</button>:null}</div>)}</div><button onClick={()=>downloadOrderDocument(id,'packing-slip')} className="mt-4 text-blue-700 underline">Printable packing slip</button></section>
          <section className="rounded-xl border bg-white p-6"><h2 className="font-semibold">Shipment tracking</h2><form onSubmit={e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.currentTarget));updateShipment(id,f).then(()=>router.refresh()).catch(err=>setError(err.message));}} className="mt-3 grid gap-2 md:grid-cols-2"><input name="carrier" required placeholder="Carrier" className="rounded border p-2"/><input name="trackingNumber" required placeholder="Tracking number" className="rounded border p-2"/><select name="status" className="rounded border p-2"><option value="shipped">Shipped</option><option value="in_transit">In transit</option><option value="out_for_delivery">Out for delivery</option><option value="delivered">Delivered</option></select><input name="location" placeholder="Location" className="rounded border p-2"/><input name="description" required placeholder="Tracking update" className="rounded border p-2 md:col-span-2"/><button className="rounded bg-orange-600 p-2 text-white md:col-span-2">Add tracking update</button></form></section>
          {order.returns?.length ? <section className="rounded-xl border bg-white p-6"><h2 className="font-semibold">Returns and refunds</h2>{order.returns.map(item=><div key={item.id} className="mt-3 rounded border p-3"><p>{item.reason} · quantity {item.quantity} · {item.status}</p>{item.status!=="refunded"?<div className="mt-2 flex gap-2"><button onClick={()=>processReturn(item.id,{status:"approved"}).then(()=>location.reload())} className="rounded border px-2 py-1">Approve</button><button onClick={()=>{const amount=prompt("Refund amount",item.refund_amount||"0");if(amount!==null)processReturn(item.id,{status:"refunded",refundAmount:Number(amount)}).then(()=>location.reload());}} className="rounded bg-green-700 px-2 py-1 text-white">Refund</button></div>:null}</div>)}</section>:null}
          <div className="flex justify-end gap-2"><button onClick={() => router.back()} className="rounded border px-4 py-2">Cancel</button><button disabled={saving} onClick={handleSave} className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-60">{saving ? "Saving…" : "Save"}</button></div>
        </> : null}
      </main>
      <Footer />
    </div>
  );
}
