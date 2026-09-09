'use client'
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { login as loginService, logout as logoutService, register as registerService } from "@/services/auth";
import { getUser } from "@/services/user"
import { getProduct } from "@/services/product";
import { deleteOrder, getOrders, updateOrder as updateOrderService } from "@/services/order";
import { getCategory } from "@/services/category";
export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY
    const router = useRouter()

    const [products, setProducts] = useState([])
    const [userData, setUserData] = useState(null)
    const [isSeller, setIsSeller] = useState(false)
    const [cartItems, setCartItems] = useState({})
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
    const register = async (name, email, password, password_confirmation) => {
        const user = await registerService(name, email, password, password_confirmation);
        if (user) {
            setUserData(user);
            setIsSeller(["Admin", "Employee"].includes(user?.roleType));
            router.push('/');
        }
    }
    const login = async (email, password) => {
        const user = await loginService(email, password);
        if (user) {
            const fullUser = await getUser();
            setUserData(fullUser);
            setIsSeller(["Admin", "Employee"].includes(fullUser?.roleType));
            router.push('/');
        }
    }
    const logout = async () => {
        await logoutService();
        setUserData(null);
        setIsSeller(false);
        router.push('/');
    }
    const updateOrder = async (id, status) => {
        const response = await updateOrderService(id, status);
        setOrders(current => current.map(order => order.id === Number(id) ? response.data : order));
        return response.data;
    }
    const removeOrder = async (id) => {
        await deleteOrder(id);
        setOrders(current => current.filter(order => order.id !== Number(id)));
    }
    const addToCart = async (itemId) => {       

        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        }
        else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);

    }
    const updateCartQuantity = async (itemId, quantity) => {

        let cartData = structuredClone(cartItems);
        if (quantity === 0) {
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

    useEffect(() => {
        fetchUserData();
        fetchProductData();
        fetchCategories();
        if (localStorage.getItem("token")) fetchOrders();
    }, [])

    const value = {
        register,
        login, logout,
        currency, router,
        isSeller, setIsSeller,
        cartItems, setCartItems,
        addToCart, updateCartQuantity,
        getCartCount, getCartAmount,

        userData, fetchUserData,
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
