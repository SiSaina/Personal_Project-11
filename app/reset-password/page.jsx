"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/services/commerce";

function ResetPasswordForm() {
  const params = useSearchParams();
  const [email, setEmail] = useState(params.get("email") || "");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const submit = async (event) => {
    event.preventDefault();
    try { const response = await resetPassword({ token: params.get("token"), email, password, password_confirmation: confirmation }); setMessage(response.message); }
    catch (error) { setMessage(error.message); }
  };
  return <main className="mx-auto min-h-screen max-w-md space-y-4 px-6 py-24"><h1 className="text-2xl font-semibold">Choose a new password</h1><form onSubmit={submit} className="space-y-4"><input aria-label="Email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded border p-3" /><input aria-label="New password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded border p-3" /><input aria-label="Confirm password" type="password" required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="w-full rounded border p-3" /><button className="w-full rounded bg-blue-600 p-3 text-white">Reset password</button></form>{message ? <p>{message}</p> : null}</main>;
}

export default function ResetPassword() {
  return <Suspense fallback={<main className="p-12">Loading…</main>}><ResetPasswordForm /></Suspense>;
}
