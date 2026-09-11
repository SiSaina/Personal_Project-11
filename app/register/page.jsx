'use client'

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { assets } from "@/assets/assets";
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const { register } = useAppContext();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password, passwordConfirm, referralCode);
        } catch (error) {
            console.error('Registration error:', error);
            alert(`Registration failed: ${error.message}`);
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 px-4">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Create an Account</h1>

                    <form onSubmit={handleRegister} className="space-y-5">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="referral-code" className="block text-sm font-medium text-gray-700">Referral code (optional)</label>
                            <input type="text" id="referral-code" value={referralCode} onChange={(e) => setReferralCode(e.target.value.toUpperCase())} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                id="confirm-password"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" id="terms" required className="h-4 w-4 text-blue-600" />
                            <label htmlFor="terms" className="text-sm text-gray-600">I agree to the terms and conditions</label>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="remember" className="h-4 w-4 text-blue-600" />
                                <label htmlFor="remember" className="text-gray-600">Remember me</label>
                            </div>
                            <a href="/forgot-password" className="text-blue-500 hover:underline">Forgot password?</a>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-150"
                        >
                            Register
                        </button>
                    </form>
                    <div className="my-6 border-t border-gray-200"></div>
                    <div className="text-center text-sm text-gray-600 mb-3">Or register with</div>
                    <div className="flex flex-row gap-4 justify-center flex-wrap">
                        <a href="/auth/google" className="flex justify-center items-center bg-white border border-gray-300 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-50 transition">
                            <Image src={assets.google_icon} alt="Google" className="w-5 h-5 mr-2" />
                            Google
                        </a>
                        <a href="/auth/github" className="flex justify-center items-center bg-black text-white py-2 px-6 rounded-md hover:bg-gray-900 transition">
                            <Image src={assets.github_icon} alt="GitHub" className="w-5 h-5 mr-2" style={{ filter: 'brightness(0) invert(1)' }} />
                            GitHub
                        </a>
                        <a href="/auth/facebook" className="flex justify-center items-center bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition">
                            <Image src={assets.facebook_icon_2} alt="Facebook" className="w-5 h-5 mr-2" style={{ filter: 'brightness(0) invert(1)' }} />
                            Facebook
                        </a>
                    </div>
                    <div className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?
                        <a href="/login" className="text-blue-500 hover:underline">Login</a>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );


}
export default RegisterPage;
