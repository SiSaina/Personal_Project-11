"use client";

import { useEffect } from "react";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";

export default function SellerGuard({ children }) {
  const { authReady, isSeller, router } = useAppContext();

  useEffect(() => {
    if (authReady && !isSeller) router.replace("/login");
  }, [authReady, isSeller, router]);

  if (!authReady || !isSeller) return <Loading />;
  return children;
}
