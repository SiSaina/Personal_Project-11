'use client'
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { login as loginService, logout as logoutService, register as registerService } from "@/services/auth";
import { getUser } from "@/services/user"
import { getProduct } from "@/services/product";
import { deleteOrder, getOrders, updateOrder as updateOrderService } from "@/services/order";
import { getCategory } from "@/services/category";
import { addWishlist, removeWishlist } from "@/services/commerce";
import { CART_STORAGE_KEY, WISHLIST_STORAGE_KEY, readStoredRecord, writeStoredRecord } from "@/services/cartStorage";
import { mergeCart } from "@/services/shopping";
export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY
    const router = useRouter()

    const [products, setProducts] = useState([])
    const [userData, setUserData] = useState(null)
    const [authReady, setAuthReady] = useState(false)
    const [isSeller, setIsSeller] = useState(false)
    const [cartItems, setCartItems] = useState({})
    const [wishlist, setWishlist] = useState({})
    const [storageReady, setStorageReady] = useState(false)
    const [orders, setOrders] = useState([])
    const [Categories, setCategories] = useState([])

    const fetchOrders = async () => {
        try {
            const data = await getOrders();
            setOrders(data.data ?? []);
        } catch (error) {
            console.error("Failed to fetch orders: ", error);
        }
    }
    const fetchProductData = async () => {
        try {
            const data = await getProduct({
                includeImages: true,
                includeCategory: true
            });
            setProducts(data.data ?? []);
        } catch (err) {
            console.error("Failed to fetch product: ", err);
        }
    }
    const fetchUserData = async () => {
        try {
            const data = await getUser();
            setUserData(data);

            setIsSeller(["Admin", "Employee"].includes(data?.roleType));
        } catch (err) {
            console.warn("User not logged in or failed to fetch user:", err);
            setUserData(null);
        } finally {
            setAuthReady(true);
        }
    }
    const fetchCategories = async () => {
        try {
            const data = await getCategory();
            setCategories(data.data);
        } catch (error) {
            console.error("Failed to fetch categories:", error.message);
        }
    };
    const register = async (name, email, password, password_confirmation, referralCode) => {
        const user = await registerService(name, email, password, password_confirmation, referralCode);
        if (user) {
            const merged = await mergeCart(cartItems);
            setCartItems(merged.data ?? cartItems);
            setUserData(user);
            setIsSeller(["Admin", "Employee"].includes(user?.roleType));
            router.push('/');
        }
    }
    const login = async (email, password) => {
        const user = await loginService(email, password);
        if (user) {
            const fullUser = await getUser();
            const merged = await mergeCart(cartItems);
            setCartItems(merged.data ?? cartItems);
            setUserData(fullUser);
            setIsSeller(["Admin", "Employee"].includes(fullUser?.roleType));
            router.push('/');
        }
    }
    const logout = async () => {
        await logoutService();
        setUserData(null);
        setIsSeller(false);
        setCartItems({});
        router.push('/');
    }
    const updateOrder = async (id, updates) => {
        const response = await updateOrderService(id, updates);
        setOrders(current => current.map(order => order.id === Number(id) ? response.data : order));
        return response.data;
    }
    const removeOrder = async (id) => {
        await deleteOrder(id);
        setOrders(current => current.filter(order => order.id !== Number(id)));
    }
    const addToCart = async (itemId) => {       
        setCartItems(current => ({ ...current, [itemId]: (current[itemId] ?? 0) + 1 }));
    }
    const updateCartQuantity = async (itemId, quantity) => {

        const cartData = structuredClone(cartItems);
        if (quantity <= 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData)

    }
    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                totalCount += cartItems[items];
            }
        }
        return totalCount;
    }
    const getCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            const itemInfo = products.find((p) => String(p.id) === String(itemId));

            if (itemInfo) {
                totalAmount += itemInfo.offerPrice * cartItems[itemId];
            }
        }
        return Math.round(totalAmount * 100) / 100;
    };

    const toggleWishlist = async (productId) => {
        const removing = Boolean(wishlist[productId]);
        setWishlist(current => {
            const next = { ...current };
            if (next[productId]) delete next[productId];
            else next[productId] = true;
            return next;
        });
        if (userData) {
            try {
                await (removing ? removeWishlist(productId) : addWishlist(productId));
            } catch (error) {
                setWishlist(current => ({ ...current, [productId]: removing || undefined }));
                throw error;
            }
        }
    };

    useEffect(() => {
        setCartItems(readStoredRecord(localStorage, CART_STORAGE_KEY));
        setWishlist(readStoredRecord(localStorage, WISHLIST_STORAGE_KEY));
        setStorageReady(true);
        fetchUserData();
        fetchProductData();
        fetchCategories();
        if (localStorage.getItem("token")) fetchOrders();
    }, [])

    useEffect(() => {
        if (storageReady) writeStoredRecord(localStorage, CART_STORAGE_KEY, cartItems);
    }, [cartItems, storageReady]);

    useEffect(() => {
        if (storageReady) writeStoredRecord(localStorage, WISHLIST_STORAGE_KEY, wishlist);
    }, [wishlist, storageReady]);

    const value = {
        register,
        login, logout,
        currency, router,
        isSeller, setIsSeller,
        cartItems, setCartItems,
        addToCart, updateCartQuantity,
        getCartCount, getCartAmount,

        userData, fetchUserData, authReady,
        wishlist, toggleWishlist,
        products, fetchProductData,
        orders, fetchOrders, updateOrder, removeOrder,
        Categories, fetchCategories
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
