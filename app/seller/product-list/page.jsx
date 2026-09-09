'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import Confirmation from "@/components/Confirmation";
import { resolveImageUrl } from "@/services/api";

const ProductListCopy = () => {

  const { router, products, removeProduct } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (products) {
      setLoading(false);
    }
  }, [products]);

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    await removeProduct(productToDelete.id);
    setShowConfirm(false);
    setProductToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setProductToDelete(null);
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between bg-gray-50">

      {loading ? (
        <Loading />
      ) : (
        <div className="w-full md:p-10 p-4 space-y-6 max-w-5xl">
          <h2 className="text-lg font-medium">All Products</h2>
          <div className="flex flex-col gap-4">
            {products.length === 0 && (
              <p className="text-center text-gray-500 py-10">No products found</p>
            )}
            {products.map((product) => (
              <div
                key={product.id}
                className="
                  group flex flex-col md:flex-row justify-between
                  p-5 rounded-lg border bg-white cursor-pointer
                  transition-all duration-300 ease-out
                  hover:shadow-lg hover:-translate-y-1 hover:border-gray-500
                  active:scale-[0.98]"
              >
                <div className="flex-1 flex gap-4 max-w-md items-center"
                  onClick={() => router.push(`/seller/product-list/${product.id}/view`)}>
                  <Image
                    src={resolveImageUrl(product.images?.[0]?.url) || assets.box_icon}
                    alt="product"
                    unoptimized
                    className="w-20 h-20 object-cover rounded transition-transform duration-300 group-hover:scale-105"
                    width={80}
                    height={80}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-sm">Price: ${product.price}</span>
                    <span className="text-sm">Offer: ${product.offerPrice}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="semibold">Category</span>
                  <span className="text-sm">{product.category?.name || "N/A"}</span>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <button
                    onClick={() => router.push(`/seller/product-list/${product.id}/edit`)}
                    className="flex items-center h-10 gap-1 px-3 py-2 bg-blue-600 text-white rounded-md transition hover:bg-blue-800 active:scale-95"
                  >
                    <span className="hidden md:block">Edit</span>
                    <Image className="h-3.5" src={assets.redirect_icon} alt="edit" />
                  </button>
                  <button
                    onClick={() => confirmDelete(product)}
                    className="flex items-center h-10 gap-1 px-3 py-2 bg-red-600 text-white rounded-md transition hover:bg-red-800 active:scale-95"
                  >
                    <span className="hidden md:block">Remove</span>
                    <Image className="h-3.5" src={assets.redirect_icon} alt="remove" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Footer />
      <Confirmation
        open={showConfirm}
        message="Are you sure you want to delete this product?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default ProductListCopy;
