import { useAppContext } from "@/context/AppContext";
import { checkoutOrder } from "@/services/order";
import React, { useEffect, useState } from "react";
import { getShippingOptions, validateAddress } from "@/services/shopping";

const OrderSummary = () => {

  const { userData, currency, router, getCartCount, getCartAmount, cartItems, setCartItems } = useAppContext()
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [userAddresses, setUserAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [shippingOptions,setShippingOptions]=useState([]);const [shippingMethod,setShippingMethod]=useState("standard");const [billingAddressId,setBillingAddressId]=useState("");const [giftWrapping,setGiftWrapping]=useState(false);const [customerNote,setCustomerNote]=useState("");

  const fetchUserAddresses = async () => {
    if (userData?.addresses) {
      setUserAddresses(userData.addresses);
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
    setBillingAddressId(current=>current||String(address.id));
    Promise.all([validateAddress(address),getShippingOptions({subtotal:getCartAmount(),postalCode:address.postalCode,country:address.country})]).then(([,response])=>setShippingOptions(response.data)).catch(error=>alert(error.message));
  };

  const createOrder = async () => {
    if (!selectedAddress) {
      alert("Please select an address before placing the order.");
      return;
    }
    if (!cartItems || Object.keys(cartItems).length === 0) {
      alert("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);
      const items = Object.keys(cartItems).map((itemId) => ({
        productId: parseInt(itemId),
        quantity: cartItems[itemId],
      }));
      const response = await checkoutOrder(selectedAddress.id, items, { couponCode, paymentMethod, billingAddressId:Number(billingAddressId||selectedAddress.id), shippingMethod, clickAndCollect:shippingMethod==='collect', giftWrapping, customerNote });
      setCartItems({});
      router.push(`/order-placed?orderId=${response.data.id}`);
    } catch (error) {
      console.error("Failed to create order:", error);
      alert(error.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserAddresses();
  }, [userData])

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Order Summary
      </h2>
      <hr className="border-gray-500/30 my-5" />
      <div className="space-y-6">
        <div>
          <label htmlFor="shippingMethod" className="text-base font-medium uppercase text-gray-600 block mb-2">Shipping</label><select id="shippingMethod" value={shippingMethod} onChange={e=>setShippingMethod(e.target.value)} className="w-full border bg-white p-2.5">{shippingOptions.length?shippingOptions.map(option=><option key={option.id} value={option.id}>{option.name} · ${option.fee} · about {option.estimatedDays} days</option>):<option value="standard">Standard delivery</option>}<option value="collect">Click and collect · Free</option></select>
        </div><div>
          <label htmlFor="billingAddress" className="text-base font-medium uppercase text-gray-600 block mb-2">Billing address</label><select id="billingAddress" value={billingAddressId} onChange={e=>setBillingAddressId(e.target.value)} className="w-full border bg-white p-2.5"><option value="">Same as delivery</option>{userAddresses.map(a=><option key={a.id} value={a.id}>{a.fullName} · {a.streetName}</option>)}</select>
        </div><label className="flex items-center gap-2"><input type="checkbox" checked={giftWrapping} onChange={e=>setGiftWrapping(e.target.checked)}/>Gift wrap this order (+$5.00)</label><textarea value={customerNote} onChange={e=>setCustomerNote(e.target.value)} maxLength={2000} placeholder="Order notes or gift message" className="w-full border p-2.5"/>
        <div>
          <label htmlFor="paymentMethod" className="text-base font-medium uppercase text-gray-600 block mb-2">Payment Method</label>
          <select id="paymentMethod" value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} className="w-full border bg-white p-2.5 text-gray-700">
            <option value="bank_transfer">Bank transfer</option>
            <option value="cash_on_delivery">Cash on delivery</option>
            <option value="manual">Arrange payment with seller</option>
            <option value="store_credit">Store credit</option>
          </select>
        </div>

        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Select Address
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.streetName}, ${selectedAddress.suburb}, ${selectedAddress.city}, ${selectedAddress.country} ${selectedAddress.postalCode}`
                  : "Select Address"}
              </span>
              <svg className={`w-5 h-5 inline float-right transition-transform duration-200 ${isDropdownOpen ? "rotate-0" : "-rotate-90"}`}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#6B7280"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                {userAddresses.map((address, index) => (
                  <li
                    key={address.id}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.streetName}, {address.suburb}, {address.city}, {address.country}, {address.postalCode}
                  </li>
                ))}
                <li
                  onClick={() => router.push("/add-address")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>

        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Promo Code
          </label>
          <div className="flex flex-col items-start gap-3">
            <input
              type="text"
              placeholder="Enter promo code"
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
              className="flex-grow w-full outline-none p-2.5 text-gray-600 border"
            />
            <p className="text-xs text-gray-500">The discount is validated securely at checkout.</p>
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items {getCartCount()}</p>
            <p className="text-gray-800">{currency}{getCartAmount()}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">Free</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Tax</p>
            <p className="font-medium text-gray-800">Included</p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>{currency}{getCartAmount().toFixed(2)}</p>
          </div>
        </div>
      </div>

      <button disabled={loading} onClick={createOrder} className="w-full bg-orange-600 disabled:opacity-60 text-white py-3 mt-5 hover:bg-orange-700">
        {loading ? "Placing..." : "Place order"}
      </button>
    </div>
  );
};

export default OrderSummary;
