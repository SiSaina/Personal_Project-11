"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import OrderItems from "@/components/OrderItems";
import Footer from "@/components/seller/Footer";
import { useAppContext } from "@/context/AppContext";
import { getOrder } from "@/services/order";

export default function OrderView() {
  const { id } = useParams();
  const router = useRouter();
  const { currency } = useAppContext();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getOrder(id).then((response) => active && setOrder(response.data))
      .catch((requestError) => active && setError(requestError.message));
    return () => { active = false; };
  }, [id]);

  if (!order && !error) return <Loading />;

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-between bg-gray-50">
      <main className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-10">
        <button onClick={() => router.back()} className="text-blue-600">← Back to orders</button>
        {error ? <p className="rounded bg-red-50 p-4 text-red-700">{error}</p> : null}
        {order ? <>
          <header className="flex flex-wrap justify-between gap-3">
            <div><h1 className="text-2xl font-semibold">Order #{order.id}</h1><p className="text-gray-500">{new Date(order.placedAt).toLocaleString()}</p></div>
            <span className="h-fit rounded-full bg-orange-100 px-3 py-1 capitalize text-orange-700">{order.status}</span>
          </header>
          <section className="rounded-xl border bg-white p-6"><h2 className="mb-4 text-lg font-medium">Items</h2><OrderItems items={order.items} currency={currency} /></section>
          <div className="grid gap-6 md:grid-cols-2">
            <section className="rounded-xl border bg-white p-6"><h2 className="mb-2 font-medium">Customer</h2><p>{order.user?.name}</p><p className="text-gray-500">{order.user?.email}</p><p className="text-gray-500">{order.user?.phone || "No phone"}</p></section>
            <section className="rounded-xl border bg-white p-6"><h2 className="mb-2 font-medium">Shipping address</h2>{order.address ? <address className="not-italic text-gray-600">{order.address.fullName}<br />{order.address.streetName}, {order.address.suburb}<br />{order.address.city}, {order.address.country} {order.address.postalCode}</address> : <p>Address unavailable</p>}</section>
          </div>
          <section className="rounded-xl border bg-white p-6 text-right"><p>Subtotal: {currency}{order.subtotal}</p><p className="text-xl font-semibold">Total: {currency}{order.total}</p></section>
        </> : null}
      </main>
      <Footer />
    </div>
  );
}
