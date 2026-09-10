'use client'
import Navbar from '@/components/seller/Navbar'
import Sidebar from '@/components/seller/Sidebar'
import React from 'react'
import SellerGuard from '@/components/SellerGuard'

const Layout = ({ children }) => {
  return (
    <SellerGuard><div>
      <Navbar />
      <div className='flex w-full'>
        <Sidebar />
        <main className='flex-1'>{children}</main>
      </div>
    </div></SellerGuard>
  )
}

export default Layout
