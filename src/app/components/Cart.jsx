"use client";

import React, { useEffect, useState } from "react";
import CartStore from "../../store/useCartStore";

export default function Cart({ userId, token }) {
  const {
    cart,
    loading,
    error,
    fetchCart,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    calculateTotals,
  } = CartStore();

  const [couponCode, setCouponCode] = useState("");

  // Fetch cart on mount
  useEffect(() => {
    if (userId && token) {
      fetchCart(userId, token);
    }
  }, [userId, token]);

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;
    updateItemQuantity(userId, productId, quantity, token);
  };

  const handleRemoveItem = (productId) => {
    removeItem(userId, productId, token);
  };

  const handleClearCart = () => {
    clearCart(userId, token);
  };

  const handleApplyCoupon = () => {
    if (!couponCode) return;
    applyCoupon(userId, couponCode, token);
  };

  const totals = calculateTotals();

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>

      {!cart || cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className="w-full border border-gray-200 mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Product</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Subtotal</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => (
                <tr key={item.product}>
                  <td className="p-2 border flex items-center gap-2">
                    {item.productSnapshot.image && (
                      <img
                        src={item.productSnapshot.image}
                        alt={item.productSnapshot.name}
                        className="w-12 h-12 object-cover"
                      />
                    )}
                    {item.productSnapshot.name}
                  </td>
                  <td className="p-2 border">₹{item.productSnapshot.price}</td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.product, Number(e.target.value))
                      }
                      className="w-16 border rounded p-1"
                    />
                  </td>
                  <td className="p-2 border">₹{item.subtotal}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleRemoveItem(item.product)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handleClearCart}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Clear Cart
            </button>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="border rounded p-1"
              />
              <button
                onClick={handleApplyCoupon}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Apply
              </button>
            </div>
          </div>

          <div className="text-right">
            <p>Total: ₹{totals.total}</p>
            <p>Discount: ₹{totals.discount}</p>
            <p className="font-bold">Grand Total: ₹{totals.grandTotal}</p>
          </div>
        </>
      )}
    </div>
  );
}
