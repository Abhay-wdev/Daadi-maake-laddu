"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingBag, Filter, Star, ShoppingCart, Check, Plus, Minus, Heart, Eye } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import useCartStore from "../../store/useCartStore";
import Link from "next/link";

const ProductsPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [updatingItems, setUpdatingItems] = useState({});
  const [showQuantityControls, setShowQuantityControls] = useState({});
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const { cart, addItem, updateItem, removeItem, fetchCart, loading: cartLoading } = useCartStore();

  const userId = "68ea79bdf93f9fc8daed29a3";
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGYxZWZmYjg2NDBlZGE5MDJkZWU2ZDIiLCJpYXQiOjE3NjEzOTM2NjcsImV4cCI6MTc2MTk5ODQ2N30.CJPFe65v-LpS5CuI4a7DjXVgO00Y3tDIGj5T1nZSK9c";

  // Sync quantities with cart whenever cart changes
  useEffect(() => {
    if (cart?.items?.length > 0) {
      const updatedQuantities = {};
      const updatedControls = {};
      
      cart.items.forEach((item) => {
        updatedQuantities[item.product._id] = item.quantity;
        updatedControls[item.product._id] = true;
      });
      
      setQuantities((prev) => ({ ...prev, ...updatedQuantities }));
      setShowQuantityControls((prev) => ({ ...prev, ...updatedControls }));
    }
  }, [cart]);

  // Fetch products and cart on mount
  useEffect(() => {
    const fetchProductsAndCart = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/products/all");
        const data = await res.json();
        let products = data.products || [];
        
        // Sort products by priorityNumber (descending: 3, 2, 1, 0)
        products.sort((a, b) => {
          const aPriority = a.priorityNumber !== undefined ? a.priorityNumber : 0;
          const bPriority = b.priorityNumber !== undefined ? b.priorityNumber : 0;
          return bPriority - aPriority;
        });
        
        setAllProducts(products);
        setFilteredProducts(products);

        const uniqueSubs = [];
        const seen = new Set();
        products.forEach((p) => {
          if (p.subCategory && !seen.has(p.subCategory._id)) {
            seen.add(p.subCategory._id);
            uniqueSubs.push(p.subCategory);
          }
        });
        setSubCategories(uniqueSubs);

        await fetchCart(userId, token);
      } catch (err) {
        console.error("Failed to fetch products/cart:", err);
        toast.error("Failed to fetch products or cart");
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCart();
  }, [fetchCart, userId, token]);

  // Filter products by subcategory
  useEffect(() => {
    if (!selectedSubCategory) {
      setFilteredProducts(allProducts);
    } else {
      // Maintain priority sorting when filtering
      const filtered = allProducts.filter((p) => p.subCategory?._id === selectedSubCategory);
      setFilteredProducts(filtered);
    }
  }, [selectedSubCategory, allProducts]);

  const handleAddToCart = async (product) => {
    const productId = product._id;
    setUpdatingItems((prev) => ({ ...prev, [productId]: true }));

    try {
      await addItem(userId, productId, 1, {}, token);
      toast.success(`${product.name} added to cart!`);
      setShowQuantityControls((prev) => ({ ...prev, [productId]: true }));
      await fetchCart(userId, token);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product to cart");
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleQuantityChange = async (productId, delta) => {
    const current = quantities[productId] || 1;
    const newQty = current + delta;
    if (newQty < 0) return;

    setQuantities((prev) => ({ ...prev, [productId]: newQty }));
    setUpdatingItems((prev) => ({ ...prev, [productId]: true }));

    try {
      if (newQty === 0) {
        await removeItem(userId, productId, token);
        setShowQuantityControls((prev) => ({ ...prev, [productId]: false }));
        toast.success("Item removed from cart");
      } else {
        await updateItem(userId, productId, newQty, token);
        toast.success("Quantity updated!");
      }
      await fetchCart(userId, token);
    } catch (err) {
      setQuantities((prev) => ({ ...prev, [productId]: current }));
      toast.error("Failed to update quantity");
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const isInCart = (productId) =>
    cart?.items?.some((item) => item.product._id === productId);

  const totalCartItems = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Products</h1>
            <p className="text-gray-600 max-w-2xl">
              Discover our premium collection of products. Each item is carefully selected for quality and value.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {totalCartItems}
              </div>
              <Link href="/cart">
                <div className="bg-white p-3 rounded-full shadow-md hover:shadow-lg transition cursor-pointer">
                  <ShoppingBag className="w-6 h-6 text-orange-500" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* --- Filter --- */}
        <div className="bg-white rounded-2xl p-4 mb-8 shadow-sm border border-orange-100">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg">
              <Filter className="w-5 h-5 text-orange-500" />
              <span className="font-medium text-gray-700">Filter:</span>
            </div>
            <button
              onClick={() => setSelectedSubCategory(null)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedSubCategory === null
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Products
            </button>
            {subCategories.map((sub) => (
              <button
                key={sub._id}
                onClick={() => setSelectedSubCategory(sub._id)}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedSubCategory === sub._id
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>

        {/* --- Products --- */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-5">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Products Found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We couldn't find any products in this category. Try selecting a different category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => {
              const productId = product._id;
              const discountedPrice = product.discount
                ? (product.price * (100 - product.discount)) / 100
                : product.price;
              const hasSecondImage = product.images && product.images.length > 1;
              const inCart = isInCart(productId);
              const isUpdating = updatingItems[productId];
              const showControls = showQuantityControls[productId];
              
              // Priority badge logic
              const priorityBadge = product.priorityNumber !== undefined && product.priorityNumber > 0 ? (
                <div className="absolute top-3 right-3 z-10">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
                    product.priorityNumber === 3 ? 'bg-purple-600' :
                    product.priorityNumber === 2 ? 'bg-blue-600' :
                    'bg-green-600'
                  }`}>
                    {product.priorityNumber === 3 ? 'Best Selling' : 
                     product.priorityNumber === 2 ? 'Best Selling ' : 
                     'Best Selling'}
                  </span>
                </div>
              ) : null;

              return (
                <div
                  key={productId}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                >
                  <Link href={`/products/${product.name.replace(/\s+/g, '-').toLowerCase()}`}>
                    <div className="relative h-72 overflow-hidden">
                      {priorityBadge}
                      {product.images?.length > 0 ? (
                        <>
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover transition-all duration-700 group-hover:scale-110"
                          />
                          {hasSecondImage && (
                            <Image
                              src={product.images[1]}
                              alt={product.name}
                              fill
                              className="object-cover absolute top-0 left-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                            />
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
                          <div className="text-center">
                            <ShoppingBag className="w-12 h-12 text-orange-300 mx-auto" />
                            <p className="text-gray-400 mt-2">No Image</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-6">
                    <Link href={`/products/${product.name.replace(/\s+/g, '-').toLowerCase()}`}>
                      <h2 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-2">
                        {product.name}
                      </h2>
                    </Link>
                    <p className="text-sm text-gray-500 mb-3">
                      {product.shortdescription}  
                    </p>
                    
                    <div className="flex items-baseline gap-2 mb-5">
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{discountedPrice.toLocaleString()}
                      </span>
                      {product.discount > 0 && (
                        <span className="text-sm line-through text-gray-400">
                          ₹{product.price.toLocaleString()}
                        </span>
                      )}
                      {product.weight}
                    </div>

                    {showControls ? (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border-2 border-orange-200 rounded-xl overflow-hidden flex-1">
                          <button
                            onClick={() => handleQuantityChange(productId, -1)}
                            disabled={isUpdating}
                            className="px-4 py-3 bg-orange-50 hover:bg-orange-100 transition disabled:opacity-50 flex-1"
                          >
                            <Minus className="w-5 h-5 text-orange-600 mx-auto" />
                          </button>
                          <span className="px-4 py-3 text-gray-800 font-bold text-lg min-w-[3rem] text-center bg-gray-50 relative">
                            {quantities[productId] || 1}
                            {isUpdating && (
                              <span className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-50">
                                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                              </span>
                            )}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(productId, 1)}
                            disabled={isUpdating}
                            className="px-4 py-3 bg-orange-50 hover:bg-orange-100 transition disabled:opacity-50 flex-1"
                          >
                            <Plus className="w-5 h-5 text-orange-600 mx-auto" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={cartLoading || isUpdating || product.stock === 0}
                        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
                          product.stock === 0
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 hover:shadow-xl"
                        }`}
                      >
                        {isUpdating ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Adding...
                          </>
                        ) : product.stock === 0 ? (
                          "Out of Stock"
                        ) : (
                          <>
                            <ShoppingCart className="w-5 h-5" />
                            ADD TO CART
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;