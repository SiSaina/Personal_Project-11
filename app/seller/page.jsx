'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { getCategory } from "@/services/category";
import { postProduct } from "@/services/product";
import { uploadImage } from "@/services/image";
import { useAppContext } from "@/context/AppContext";

const AddProduct = () => {
  const [files, setFiles] = useState(Array(4).fill(null));
  const { Categories, fetchCategories } = useAppContext();

  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    price: "",
    offerPrice: "",
    sku: "",
    stockQuantity: "",
    lowStockThreshold: "5",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!Categories.length) {
      fetchCategories();
    }
  }, [Categories]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (index, file) => {
    setError("");
    if (file && !["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Choose a JPG, PNG, or WebP image.");
      return;
    }
    if (file && file.size > 5 * 1024 * 1024) {
      setError("Each image must be 5 MB or smaller.");
      return;
    }
    setFiles((current) => current.map((value, position) => position === index ? file : value));
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      categoryId: "",
      price: "",
      offerPrice: "",
      sku: "",
      stockQuantity: "",
      lowStockThreshold: "5",
    });
    setFiles(Array(4).fill(null));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      setError("");
      setMessage("");

      if (!files.some(Boolean)) {
        setError("Select at least one product image.");
        return;
      }

      const productData = {
        name: form.name,
        description: form.description,
        categoryId: form.categoryId,
        price: parseFloat(form.price),
        offerPrice: parseFloat(form.offerPrice),
        sku: form.sku || null,
        stockQuantity: Number(form.stockQuantity),
        lowStockThreshold: Number(form.lowStockThreshold),
        date: new Date().toISOString().split("T")[0],
      };

      const response = await postProduct(productData);

      for (const file of files) {
        if (file) {
          await uploadImage(response.data.id, file);
        }
      }

      resetForm();
      setMessage("Product and images uploaded successfully.");
    } catch (error) {
      console.error("Failed to create product:", error.message);
      setError(error.message || "The product image could not be uploaded.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-6 max-w-lg">
        {error ? <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        {message ? <p role="status" className="rounded bg-green-50 p-3 text-sm text-green-700">{message}</p> : null}
        <div>
          <p className="text-base font-medium">Product Images</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {files.map((file, index) => (
              <label key={index} htmlFor={`image-${index}`}>
                <input
                  id={`image-${index}`}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  hidden
                  disabled={loading}
                  onChange={(e) => handleFileChange(index, e.target.files?.[0] ?? null)}
                />
                <Image
                  src={file ? URL.createObjectURL(file) : assets.upload_area}
                  alt="upload"
                  width={100}
                  height={100}
                  className="max-w-24 cursor-pointer rounded border"
                />
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-base font-medium">Product Name</label>
          <input
            id="name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            value={form.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-base font-medium">Product Description</label>
          <textarea
            id="description"
            rows={4}
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            value={form.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col gap-1 w-32"><label className="text-base font-medium">SKU</label><input id="sku" className="rounded border px-3 py-2" value={form.sku} onChange={handleInputChange} /></div>
          <div className="flex flex-col gap-1 w-32"><label className="text-base font-medium">Stock</label><input id="stockQuantity" type="number" min="0" required className="rounded border px-3 py-2" value={form.stockQuantity} onChange={handleInputChange} /></div>
          <div className="flex flex-col gap-1 w-32"><label className="text-base font-medium">Low alert</label><input id="lowStockThreshold" type="number" min="0" required className="rounded border px-3 py-2" value={form.lowStockThreshold} onChange={handleInputChange} /></div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium">Category</label>
            <select
              id="categoryId"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              value={form.categoryId}
              onChange={handleInputChange}
              required
              disabled={loading}
            >
              <option value="">Select</option>
              {Categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium">Product Price</label>
            <input
              id="price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              value={form.price}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium">Offer Price</label>
            <input
              id="offerPrice"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              value={form.offerPrice}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded hover:bg-orange-700 disabled:opacity-60"
        >
          {loading ? "Adding..." : "ADD"}
        </button>

      </form>
    </div>
  );
};

export default AddProduct;
