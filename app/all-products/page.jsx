'use client'
import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";

const AllProducts = () => {

    const { products, Categories } = useAppContext();
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const filteredProducts = useMemo(() => products.filter((product) => {
        const matchesSearch = `${product.name} ${product.description}`.toLowerCase().includes(search.toLowerCase());
        return matchesSearch && (!category || String(product.category?.id) === category);
    }), [products, search, category]);

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
                <div className="flex flex-col items-end pt-12">
                    <p className="text-2xl font-medium">All products</p>
                    <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
                </div>
                <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
                    <input aria-label="Search products" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" className="flex-1 rounded border px-4 py-2" />
                    <select aria-label="Filter by category" value={category} onChange={(event) => setCategory(event.target.value)} className="rounded border px-4 py-2">
                        <option value="">All categories</option>
                        {Categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">
                    {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AllProducts;
