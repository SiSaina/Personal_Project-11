"use client";

import Image from "next/image";
import { assets } from "@/assets/assets";
import { resolveImageUrl } from "@/services/api";

export default function OrderItems({ items = [], currency = "$" }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-4 rounded-md border p-3">
          <Image
            src={resolveImageUrl(item.imageUrl) || assets.box_icon}
            alt={item.productName}
            width={72}
            height={72}
            unoptimized
            className="h-18 w-18 rounded object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{item.productName}</p>
            <p className="text-sm text-gray-500">
              {currency}{item.unitPrice} × {item.quantity}
            </p>
          </div>
          <p className="font-semibold">{currency}{item.lineTotal}</p>
        </div>
      ))}
    </div>
  );
}
