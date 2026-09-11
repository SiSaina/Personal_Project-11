"use client"
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import CartDrawer from "@/components/CartDrawer";
import { getSuggestions } from "@/services/shopping";

const Navbar = () => {

  const { userData, isSeller, router, cartItems } = useAppContext();
  const [cartOpen,setCartOpen]=useState(false); const [query,setQuery]=useState(""); const [suggestions,setSuggestions]=useState([]);
  useEffect(()=>{if(query.trim().length<2){setSuggestions([]);return;}let active=true;const timer=setTimeout(()=>getSuggestions(query).then(r=>active&&setSuggestions(r.data)).catch(()=>{}),200);return()=>{active=false;clearTimeout(timer);};},[query]);

  return (
    <><nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push('/')}
        src={assets.logo}
        alt="logo"
      />
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">Home</Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">Shop</Link>
        <Link href="/about" className="hover:text-gray-900 transition">About Us</Link>
        <Link href="/contact" className="hover:text-gray-900 transition">Contact</Link>
        {userData ? <Link href="/wishlist" className="hover:text-gray-900 transition">Wishlist</Link> : null}
        {userData ? <Link href="/saved" className="hover:text-gray-900 transition">Saved</Link> : null}

        {isSeller && <button onClick={() => router.push('/seller')} className="text-xs border px-4 py-1.5 rounded-full">Seller Dashboard</button>}

      </div>

      <ul className="hidden md:flex items-center gap-4 ">
        <div className="relative"><input aria-label="Search products" value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')router.push(`/all-products?search=${encodeURIComponent(query)}`)}} placeholder="Search" className="w-32 rounded border px-2 py-1 text-sm"/>{suggestions.length?<div className="absolute right-0 top-full z-40 mt-1 w-64 rounded border bg-white shadow">{suggestions.map(s=><button key={s.id} onClick={()=>router.push(`/product/${s.id}`)} className="block w-full px-3 py-2 text-left hover:bg-gray-50">{s.name} · ${s.price}</button>)}</div>:null}</div>
        {cartItems ? (
          <div className="relative">
            <button onClick={() => setCartOpen(true)}>
              <Image className="w-4 h-4 mt-2" src={assets.cart_icon} alt="cart icon" />
              {Object.keys(cartItems).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-medium px-1 rounded-full">
                  {Object.keys(cartItems).length}
                </span>
              )}
            </button>
          </div>
        ) : (
          <div></div>
        )}

        {userData ? (
          <button onClick={() => router.push('/profile')} className="flex items-center gap-2 hover:text-gray-900 transition">
            <Image src={assets.user_icon} alt="user icon" />
            Account
          </button>
        ) : (
          <button onClick={() => router.push('/login')} className="flex items-center gap-2 hover:text-gray-900 transition">
            <Image src={assets.user_icon} alt="user icon" />
            Login
          </button>
        )}

      </ul>

    </nav><CartDrawer open={cartOpen} onClose={()=>setCartOpen(false)}/></>
  );
};

export default Navbar;
