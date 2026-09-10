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
  });

  const [loading, setLoading] = useState(false);

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
    const updated = [...files];
    updated[index] = file;
    setFiles(updated);
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      categoryId: "",
      price: "",
      offerPrice: "",
    });
    setFiles(Array(4).fill(null));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      const productData = {
        name: form.name,
        description: form.description,
        categoryId: form.categoryId,
        price: parseFloat(form.price),
        offerPrice: parseFloat(form.offerPrice),
        date: new Date().toISOString().split("T")[0],
      };

      const response = await postProduct(productData);

      for (const file of files) {
        if (file) {
          await uploadImage(response.data.id, file);
        }
      }

      resetForm();
    } catch (error) {
      console.error("Failed to create product:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-6 max-w-lg">
        <div>
          <p className="text-base font-medium">Product Images</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {files.map((file, index) => (
              <label key={index} htmlFor={`image-${index}`}>
                <input
                  id={`image-${index}`}
                  type="file"
                  hidden
                  onChange={(e) => handleFileChange(index, e.target.files[0])}
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
