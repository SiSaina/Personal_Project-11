'use client'

import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { assets } from '@/assets/assets';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

const ProfilePage = () => {
    const { userData, logout } = useAppContext();
    const [user, setUser] = useState(null);
    const router = useRouter()
    useEffect(() => {
        if (userData) {
            setUser(userData);
        }
    }, [userData]);

    const handleLogout = () => {
        logout();
        router.push('/');
    };
    const handleVerifyEmail = async () => {
        try {
            //email verification logic
            alert('Email verification link sent!');
        } catch (error) {
            console.error('Email verification error:', error);
            alert(`Email verification failed: ${error.message}`);
        }
    };
    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
                <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-2xl">
                    <div className="flex flex-col items-center text-center">
                        <Image
                            src={assets.girl_with_headphone_image}
                            alt="Profile"
                            className="w-28 h-28 rounded-full object-cover border mb-4"
                        />
                        <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
                        <p className="text-gray-600">{user?.email}</p>
                        <div className="mt-1 text-sm">
                            {user?.email_verified_at ? (
                                <span className="text-green-600 font-medium">Email Verified</span>
                            ) : (
                                <div className="flex items-center justify-center gap-2 text-red-500">
                                    <span>Email Not Verified</span>
                                    <button
                                        onClick={handleVerifyEmail}
                                        className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                    >
                                        Verify Email
                                    </button>
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            Joined: {new Date(user?.created_at).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="mt-6 space-y-2 text-left text-gray-700">
                        <p><strong>Phone:</strong> {user?.phone ?? 'Unknown'}</p>
                    </div>

                    {user?.addresses?.length > 0 ? (
                        <div>
                            <div className="mt-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-2">Addresses</h2>
                                <ul className="space-y-3 text-gray-700 text-sm">
                                    {user.addresses.map((address, index) => (
                                        <li key={index} className="p-3 bg-gray-50 rounded shadow-sm">
                                            <p><strong>Full Name:</strong> {address.fullName}</p>
                                            <p><strong>Postal Code:</strong> {address.postalCode}</p>
                                            <p><strong>Street name:</strong> {address.streetName}</p>
                                            <p><strong>Suburb:</strong> {address.suburb}</p>
                                            <p><strong>City:</strong> {address.city}</p>
                                            <p><strong>Country:</strong> {address.country}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className='mt-6 flex gap-4'>
                                <button
                                    className='px-4 py-2 bg-blue-700 text-white rounded-xl shadow-md hover:bg-blue-800 transition-all'
                                    onClick={() => router.push('/add-address')}
                                >
                                    Add Address
                                </button>
                                <button
                                    className='px-4 py-2 bg-red-700 text-white rounded-xl shadow-md hover:bg-green-800 transition-all'
                                    onClick={() => router.push('/my-orders')}
                                >
                                    My Orders
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className='mt-6'>
                            <button
                                className='px-4 py-2 bg-blue-700 text-white rounded-xl shadow-md hover:bg-blue-800 transition-all'
                                onClick={() => router.push('/add-address')}
                            >
                                Add Address
                            </button>
                        </div>
                    )}

                    <div className="mt-10 space-y-4">
                        <button
                            onClick={() => router.push('/edit-profile')}
                            className="w-full bg-blue-600 text-white font-medium py-3 rounded-xl shadow-md hover:bg-blue-700 transition-all"
                        >
                            Edit Profile
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={() => router.push('/change-password')}
                                className="w-full bg-amber-500 text-white font-medium py-3 rounded-xl shadow-md hover:bg-amber-600 transition-all"
                            >
                                Change Password
                            </button>
                            <button
                                onClick={() => router.push('/forgot-password')}
                                className="w-full bg-indigo-500 text-white font-medium py-3 rounded-xl shadow-md hover:bg-indigo-600 transition-all"
                            >
                                Forgot Password
                            </button>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full bg-rose-600 text-white font-medium py-3 rounded-xl shadow-md hover:bg-rose-700 transition-all"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
export default ProfilePage;
