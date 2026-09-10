"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Footer from "@/components/Footer"; import Loading from "@/components/Loading"; import Navbar from "@/components/Navbar"; import OrderItems from "@/components/OrderItems";
import { useAppContext } from "@/context/AppContext"; import { getOrder } from "@/services/order";

export default function OrderDetail() {
  const { id } = useParams(); const { currency } = useAppContext(); const [order, setOrder] = useState(null); const [error, setError] = useState("");
  useEffect(() => { let active = true; getOrder(id).then((response) => active && setOrder(response.data)).catch((requestError) => active && setError(requestError.message)); return () => { active = false; }; }, [id]);
  return <><Navbar /><main className="min-h-screen px-6 py-12 md:px-16 lg:px-32">{!order && !error ? <Loading /> : null}{error ? <p className="rounded bg-red-50 p-4 text-red-700">{error}</p> : null}{order ? <article className="mx-auto max-w-4xl rounded-xl border bg-white p-6 shadow-sm"><header className="mb-6 flex flex-wrap justify-between gap-4"><div><p className="text-sm text-gray-500">Placed {new Date(order.placedAt).toLocaleString()}</p><h1 className="text-2xl font-semibold">Order #{order.id}</h1></div><div className="text-right"><p className="capitalize font-medium text-orange-700">{order.fulfillmentStatus}</p><p className="text-sm capitalize text-gray-500">Payment: {order.paymentStatus} · {order.paymentMethod.replaceAll("_", " ")}</p></div></header><OrderItems items={order.items} currency={currency} /><div className="mt-6 grid gap-5 border-t pt-5 md:grid-cols-2"><address className="not-italic text-sm text-gray-600"><strong className="text-gray-900">Ship to</strong><p>{order.address?.fullName}<br />{order.address?.streetName}, {order.address?.suburb}<br />{order.address?.city}, {order.address?.country} {order.address?.postalCode}</p></address><div className="text-right"><p>Subtotal: {currency}{order.subtotal}</p>{Number(order.discountTotal) > 0 ? <p>Discount: -{currency}{order.discountTotal}</p> : null}<p className="text-xl font-semibold">Total: {currency}{order.total}</p></div></div></article> : null}</main><Footer /></>;
}
