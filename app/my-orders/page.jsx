"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import { getOrders } from "@/services/order";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { let active = true; getOrders().then((response) => active && setOrders(response.data ?? [])).catch((requestError) => active && setError(requestError.message)).finally(() => active && setLoading(false)); return () => { active = false; }; }, []);
  return <><Navbar /><main className="min-h-screen px-6 py-12 md:px-16 lg:px-32"><h1 className="mb-6 text-2xl font-semibold">My Orders</h1>{loading ? <Loading /> : null}{error ? <p className="rounded bg-red-50 p-4 text-red-700">{error}</p> : null}<div className="space-y-4">{orders.map((order) => <Link key={order.id} href={`/my-orders/${order.id}`} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-white p-5 shadow-sm"><div><h2 className="font-semibold">Order #{order.id}</h2><p className="text-sm text-gray-500">{new Date(order.placedAt).toLocaleString()}</p></div><div className="text-right"><p className="capitalize text-orange-700">{order.fulfillmentStatus}</p><p className="font-semibold">${order.total}</p></div></Link>)}</div>{!loading && !error && orders.length === 0 ? <p>No orders found.</p> : null}</main><Footer /></>;
}
