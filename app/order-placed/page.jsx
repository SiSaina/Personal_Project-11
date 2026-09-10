"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Loading from "@/components/Loading";
import OrderItems from "@/components/OrderItems";
import { useAppContext } from "@/context/AppContext";
import { getOrder } from "@/services/order";

function Confirmation() {
  const orderId = useSearchParams().get("orderId");
  const { currency } = useAppContext();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) { setError("No order number was provided."); return; }
    let active = true;
    getOrder(orderId).then((response) => active && setOrder(response.data))
      .catch((requestError) => active && setError(requestError.message));
    return () => { active = false; };
  }, [orderId]);

  if (!order && !error) return <Loading />;
  if (error) return <p className="rounded bg-red-50 p-4 text-red-700">{error}</p>;
  return <section className="w-full max-w-2xl rounded-xl border bg-white p-6 shadow-sm">
    <p className="text-sm font-medium text-green-700">Order placed successfully</p><h1 className="mt-1 text-3xl font-semibold">Order #{order.id}</h1>
    <p className="mt-2 text-gray-600">A confirmation email has been sent. Payment: {order.paymentMethod.replaceAll("_", " ")} ({order.paymentStatus}).</p>
    <div className="my-6 border-y py-5"><OrderItems items={order.items} currency={currency} /></div>
    <div className="space-y-2 text-right"><p>Subtotal: {currency}{order.subtotal}</p>{Number(order.discountTotal) > 0 ? <p>Discount: -{currency}{order.discountTotal}</p> : null}<p className="text-xl font-semibold">Total: {currency}{order.total}</p></div>
    <Link href={`/my-orders/${order.id}`} className="mt-6 block rounded bg-orange-600 px-4 py-3 text-center text-white">View order</Link>
  </section>;
}

export default function OrderPlaced() {
  return <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6"><Suspense fallback={<Loading />}><Confirmation /></Suspense></main>;
}
