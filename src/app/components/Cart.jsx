"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import useCartStore from "../../store/useCartStore";
import { Loader2, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Link from "next/link";

const Cart = () => {
  const pathname = usePathname();
  const {
    cart,
    loading,
    updatingItem,
    error,
    fetchCart,
    removeItem,
    updateItem,
    clearCart,
    calculateTotals,
  } = useCartStore();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [updatingProductId, setUpdatingProductId] = useState(null);
  const [isClearing, setIsClearing] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Theme colors
  const themeColor = "#943900";
  const themeLight = "#c46e00"; // Lighter shade for hover states
  const themeBackground = "#f5e6d0"; // Light background for active states

  // Load user & token from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser && savedToken) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setToken(savedToken);
      fetchCart(parsedUser._id, savedToken);
    }
  }, [fetchCart]);

  // Function to handle placing the order
  const handlePlaceOrder = async () => {
    try {
      setIsPlacingOrder(true);
      
      // Get user ID and address ID from localStorage
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");
      const savedAddressId = localStorage.getItem("shippingAddressId");
      
      if (!savedUser || !savedToken) {
        alert("User not authenticated. Please log in again.");
        setIsPlacingOrder(false);
        return;
      }
      
      if (!savedAddressId) {
        alert("No shipping address found. Please add a shipping address.");
        setIsPlacingOrder(false);
        return;
      }
      
      const parsedUser = JSON.parse(savedUser);
      
      // Prepare the order data
      const orderData = {
        userId: parsedUser._id,
        addressId: savedAddressId
      };
      
      // Make the API call
      const response = await fetch("https://ecom-backend-4-ysxq.onrender.com/api/orders/place-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${savedToken}`
        },
        body: JSON.stringify(orderData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Order placed successfully
        alert("Order placed successfully!");
        // Clear the cart after successful order
        await clearCart(parsedUser._id, savedToken);
        // Redirect to order confirmation or orders page
        window.location.href = "/orders"; // Adjust the URL as needed
      } else {
        // Handle error
        alert(`Failed to place order: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing your order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!user || !token)
    return (
      <div className="text-center p-6 sm:p-10 text-gray-600">
        <ShoppingBag className="mx-auto w-10 h-10 sm:w-12 sm:h-12 mb-3 text-gray-400" />
        <p className="text-sm sm:text-base">Please log in to view your cart.</p>
      </div>
    );

  if (loading && !cart?.items)
    return (
      <div className="flex flex-col items-center justify-center p-6 sm:p-10 text-gray-600">
        <Loader2 className="animate-spin w-8 h-8 sm:w-10 sm:h-10 mb-2" style={{ color: themeColor }} />
        <p className="text-sm sm:text-base">Loading your cart...</p>
      </div>
    );

  const totals = calculateTotals();

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-md max-w-3xl mx-auto mt-4 sm:mt-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center" style={{ color: themeColor }}>
        🛒 Your Cart
      </h2>

      {cart?.items?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-gray-600 animate-fadeIn">
          <img
            src="/images/emptycart.gif"
            alt="Empty Cart"
            className="w-44 sm:w-56 md:w-64 mb-6 opacity-90 drop-shadow-md transition-transform duration-300 hover:scale-105"
          />
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-sm sm:text-base text-gray-500 mb-6 text-center px-4">
            Looks like you haven't added anything yet.
          </p>
          <Link
            href="/products"
            className="px-6 py-2.5 text-white rounded-full shadow-md transition-all duration-300 text-sm sm:text-base"
            style={{ backgroundColor: themeColor }}
          >
            Continue Shopping
          </Link>
            <Link
            href="/orders"
            className="px-6 mt-2 py-2.5 text-white rounded-full shadow-md transition-all duration-300 text-sm sm:text-base"
            style={{ backgroundColor: themeColor }}
          >
           Order history
          </Link>
        </div>
      ) : (
        <>
          {/* Fixed height section with smooth scroll */}
          <div
            className="overflow-y-auto space-y-3 sm:space-y-4 pr-1"
            style={{
              maxHeight: "400px",
              minHeight: "100px",
            }}
          >
            {cart.items.map((item) => {
              const isUpdating = updatingProductId === item.product;

              return (
                <div
                  key={item._id}
                  className={`relative flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-50 border border-gray-200 rounded-md p-3 sm:p-4 shadow-sm hover:shadow-md transition gap-3 sm:gap-0`}
                >
                  {/* Loader overlay on update */}
                  {isUpdating && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-md z-10">
                      <Loader2 className="animate-spin w-6 h-6" style={{ color: themeColor }} />
                    </div>
                  )}

                  {/* Product Details */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <img
                      src={item.productSnapshot.image || "/no-image.png"}
                      alt={item.productSnapshot.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-md border flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                        {item.productSnapshot.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600">
                        ₹{item.productSnapshot.price} × {item.quantity}
                      </p>
                      <p className="text-xs sm:text-sm font-medium" style={{ color: themeColor }}>
                        Subtotal: ₹
                        {(item.productSnapshot.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        className="px-2 py-1 rounded disabled:opacity-50 touch-manipulation"
                        style={{ backgroundColor: "#e5e7eb" }}
                        onClick={async () => {
                          if (item.quantity > 1) {
                            setUpdatingProductId(item.product);
                            await updateItem(
                              user._id,
                              item.product.$oid || item.product,
                              item.quantity - 1,
                              token
                            );
                            setUpdatingProductId(null);
                          }
                        }}
                        disabled={item.quantity <= 1 || isUpdating}
                      >
                        <Minus size={14} className="sm:w-4 sm:h-4" />
                      </button>

                      <span className="w-6 sm:w-8 text-center font-medium text-sm sm:text-base">
                        {item.quantity}
                      </span>

                      <button
                        className="px-2 py-1 rounded disabled:opacity-50 touch-manipulation"
                        style={{ backgroundColor: "#e5e7eb" }}
                        onClick={async () => {
                          setUpdatingProductId(item.product);
                          await updateItem(
                            user._id,
                            item.product.$oid || item.product,
                            item.quantity + 1,
                            token
                          );
                          setUpdatingProductId(null);
                        }}
                        disabled={isUpdating}
                      >
                        <Plus size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>

                    <button
                      className="text-white px-2 sm:px-3 py-1 rounded flex items-center gap-1 text-xs sm:text-sm touch-manipulation whitespace-nowrap"
                      style={{ backgroundColor: "#dc2626" }}
                      onClick={async () => {
                        setUpdatingProductId(item.product);
                        await removeItem(
                          user._id,
                          item.product.$oid || item.product,
                          token
                        );
                        setUpdatingProductId(null);
                      }}
                      disabled={isUpdating}
                    >
                      <Trash2 size={13} className="sm:w-4 sm:h-4" /> Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totals Section */}
          <div className="mt-4 sm:mt-6 border-t pt-4 space-y-2 bg-white rounded-lg p-3 sm:p-4">
            <div className="space-y-1 sm:space-y-2 text-right">
              <p className="text-base sm:text-lg text-gray-700">
                Total Price: ₹{totals.totalPrice.toFixed(2)}
              </p>
              <p className="text-base sm:text-lg text-gray-600">
                Discount: ₹{totals.discount.toFixed(2)}
              </p>
              <p className="text-xl sm:text-2xl font-semibold" style={{ color: "#16a34a" }}>
                Grand Total: ₹{totals.grandTotal.toFixed(2)}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4">
              <button
                className="text-white px-4 py-2 rounded text-sm sm:text-base w-full sm:w-auto touch-manipulation"
                style={{ backgroundColor: "#dc2626" }}
                onClick={async () => {
                  setIsClearing(true);
                  await clearCart(user._id, token);
                  setIsClearing(false);
                }}
                disabled={isClearing}
              >
                {isClearing ? (
                  <Loader2 className="animate-spin w-4 h-4 inline mr-1" />
                ) : null}
                Clear Cart
              </button>
              
              {/* Conditional rendering based on current path */}
              {pathname === '/checkout' ? (
                <button 
                  className="text-white px-4 py-2 rounded text-sm sm:text-base w-full sm:w-auto touch-manipulation flex items-center justify-center"
                  style={{ backgroundColor: "#16a34a" }}
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                >
                  {isPlacingOrder ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4 mr-2" />
                      Processing...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </button>
              ) : (
                <Link href="/checkout" className="w-full sm:w-auto">
                  <button 
                    className="text-white px-4 py-2 rounded text-sm sm:text-base w-full sm:w-auto touch-manipulation"
                    style={{ backgroundColor: themeColor }}
                  >
                    Proceed to Checkout →
                  </button>
                </Link>
              )}
             
            </div>
            
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;