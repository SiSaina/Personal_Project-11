"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/services/commerce";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const submit = async (event) => {
    event.preventDefault();
    try { const response = await forgotPassword(email); setMessage(response.message); }
    catch (error) { setMessage(error.message); }
  };
  return <main className="mx-auto min-h-screen max-w-md px-6 py-24"><h1 className="mb-2 text-2xl font-semibold">Reset your password</h1><p className="mb-6 text-gray-500">We’ll email instructions if the account exists.</p><form onSubmit={submit} className="space-y-4"><input aria-label="Email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded border p-3" /><button className="w-full rounded bg-blue-600 p-3 text-white">Send reset link</button></form>{message ? <p className="mt-4">{message}</p> : null}<Link href="/login" className="mt-6 block text-blue-600">Back to login</Link></main>;
}
