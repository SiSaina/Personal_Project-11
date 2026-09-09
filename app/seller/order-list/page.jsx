"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Confirmation from "@/components/Confirmation";
import Loading from "@/components/Loading";
import OrderItems from "@/components/OrderItems";
import Footer from "@/components/seller/Footer";
import { useAppContext } from "@/context/AppContext";

export default function OrderList() {
  const { currency, fetchOrders, orders, removeOrder, userData } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    let active = true;
    fetchOrders().catch((requestError) => active && setError(requestError.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const confirmDelete = async () => {
    try {
      await removeOrder(selected.id);
      setSelected(null);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-between text-sm">
      <main className="space-y-5 p-4 md:p-10">
        <h1 className="text-xl font-semibold">Orders</h1>
        {loading ? <Loading /> : null}
        {error ? <p className="rounded bg-red-50 p-4 text-red-700">{error}</p> : null}
        {!loading && orders.length === 0 ? <p className="text-gray-500">No orders found.</p> : null}
        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="rounded-lg border bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <button className="text-left" onClick={() => router.push(`/seller/order-list/${order.id}/view`)}>
                  <span className="block text-base font-semibold">Order #{order.id}</span>
                  <span className="text-gray-500">{order.user?.name ?? `Customer #${order.userId}`} · {new Date(order.placedAt).toLocaleString()}</span>
                </button>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-orange-100 px-3 py-1 capitalize text-orange-700">{order.status}</span>
                  <button onClick={() => router.push(`/seller/order-list/${order.id}/edit`)} className="rounded bg-blue-600 px-3 py-2 text-white">Edit</button>
                  {userData?.roleType === "Admin" ? <button onClick={() => setSelected(order)} className="rounded bg-red-600 px-3 py-2 text-white">Delete</button> : null}
                </div>
              </div>
              <OrderItems items={order.items} currency={currency} />
              <p className="mt-4 text-right text-lg font-semibold">Total: {currency}{order.total}</p>
            </article>
          ))}
        </div>
      </main>
      <Footer />
      <Confirmation open={Boolean(selected)} message="Delete this order permanently?" onConfirm={confirmDelete} onCancel={() => setSelected(null)} />
    </div>
  );
}
