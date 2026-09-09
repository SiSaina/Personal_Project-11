"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import OrderItems from "@/components/OrderItems";
import { useAppContext } from "@/context/AppContext";
import { getOrders } from "@/services/order";

export default function MyOrders() {
  const { currency, userData } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userData) return;
    let active = true;
    getOrders()
      .then((response) => active && setOrders(response.data ?? []))
      .catch((requestError) => active && setError(requestError.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [userData]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-6 py-12 md:px-16 lg:px-32">
        <h1 className="mb-6 text-2xl font-semibold">My Orders</h1>
        {loading ? <Loading /> : null}
        {error ? <p className="rounded bg-red-50 p-4 text-red-700">{error}</p> : null}
        {!loading && !error && orders.length === 0 ? <p className="text-gray-500">No orders found.</p> : null}
        <div className="space-y-6">
          {orders.map((order) => (
            <article key={order.id} className="rounded-xl border bg-white p-5 shadow-sm">
              <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                  <p className="text-sm text-gray-500">{new Date(order.placedAt).toLocaleString()}</p>
                </div>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-sm capitalize text-orange-700">{order.status}</span>
              </header>
              <OrderItems items={order.items} currency={currency} />
              <div className="mt-5 grid gap-4 border-t pt-4 md:grid-cols-2">
                <address className="not-italic text-sm text-gray-600">
                  <p className="font-medium text-gray-900">Ship to</p>
                  {order.address ? <p>{order.address.fullName}, {order.address.streetName}, {order.address.suburb}, {order.address.city}, {order.address.country} {order.address.postalCode}</p> : <p>Address unavailable</p>}
                </address>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Subtotal: {currency}{order.subtotal}</p>
                  <p className="text-lg font-semibold">Total: {currency}{order.total}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
