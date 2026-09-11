"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { getDashboard, getLowStock, getReports } from "@/services/admin";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null); const [report, setReport] = useState(null); const [stock, setStock] = useState([]); const [error, setError] = useState("");
  useEffect(() => { let active = true; Promise.all([getDashboard(), getReports(), getLowStock()]).then(([d, r, s]) => { if (active) { setDashboard(d.data); setReport(r.data); setStock(s.data); } }).catch((e) => active && setError(e.message)); return () => { active = false; }; }, []);
  if (!dashboard && !error) return <Loading />;
  const maxRevenue = Math.max(1, ...(dashboard?.monthlySales ?? []).map((row) => row.revenue));
  return <div className="space-y-8 p-4 md:p-10"><header><h1 className="text-2xl font-semibold">Commerce dashboard</h1><p className="text-gray-500">Sales, customers, fulfillment risk, and tax in one view.</p></header>{error ? <p className="rounded bg-red-50 p-4 text-red-700">{error}</p> : null}{dashboard ? <>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{[["Revenue", `$${dashboard.revenue}`],["Orders",dashboard.orders],["Customers",dashboard.customers],["Low stock",dashboard.lowStock],["Open tickets",dashboard.openTickets]].map(([label,value])=><article key={label} className="rounded-xl border bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></article>)}</section>
    <section className="rounded-xl border bg-white p-6"><h2 className="font-semibold">Monthly paid sales</h2><div className="mt-6 flex h-52 items-end gap-3 overflow-x-auto">{dashboard.monthlySales.map((row)=><div key={row.period} className="flex min-w-14 flex-1 flex-col items-center justify-end gap-2"><span className="text-xs">${row.revenue}</span><div title={`${row.orders} orders`} className="w-full rounded-t bg-orange-500" style={{height:`${Math.max(4,(row.revenue/maxRevenue)*160)}px`}} /><span className="text-xs text-gray-500">{row.period}</span></div>)}</div></section>
    <section className="grid gap-6 lg:grid-cols-2"><article className="rounded-xl border bg-white p-6"><h2 className="font-semibold">Sales and tax report</h2>{report ? <dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><dt>Paid orders</dt><dd className="text-right">{report.orders}</dd><dt>Gross sales</dt><dd className="text-right">${report.grossSales}</dd><dt>Discounts</dt><dd className="text-right">${report.discounts}</dd><dt>Tax included ({report.taxRate}%)</dt><dd className="text-right">${report.taxIncluded}</dd><dt>Items sold</dt><dd className="text-right">{report.itemsSold}</dd></dl> : null}</article><article className="rounded-xl border bg-white p-6"><h2 className="font-semibold">Low-stock alerts</h2><div className="mt-4 space-y-2">{stock.map((product)=><div key={product.id} className="flex justify-between text-sm"><span>{product.name}</span><strong className="text-red-600">{product.stockQuantity} left</strong></div>)}{stock.length===0?<p className="text-sm text-gray-500">Inventory levels are healthy.</p>:null}</div></article></section>
  </>:null}</div>;
}
