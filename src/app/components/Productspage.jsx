"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingBag, Filter, Star, ShoppingCart, Check, Plus, Minus, Heart, Eye } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import useCartStore from "../../store/useCartStore";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const ProductsPage = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [updatingItems, setUpdatingItems] = useState({});
  const [showQuantityControls, setShowQuantityControls] = useState({});
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [showAllProducts, setShowAllProducts] = useState(false); // New state for showing all products

  const { cart, addItem, updateItem, removeItem, fetchCart, loading: cartLoading } = useCartStore();
 

  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser._id);
      setToken(storedToken);
    }
  }, []);

  // Convert text to URL-friendly slug
  const toSlug = (text) => text.toLowerCase().replace(/\s+/g, '-');

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
        const res = await fetch("https://ecom-backend-1-cv44.onrender.com/api/products/all");
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

        if (userId && token) {
          await fetchCart(userId, token);
        }
      } catch (err) {
        console.error("Failed to fetch products/cart:", err);
        toast.error("Failed to fetch products or cart");
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCart();
  }, [fetchCart, userId, token]);

  // Handle subcategory filtering from URL query
  useEffect(() => {
    if (subCategories.length > 0) {
      const querySub = searchParams.get('subCategory');
      
      if (querySub) {
        const foundSub = subCategories.find(sub => toSlug(sub.name) === querySub);
        if (foundSub) {
          setSelectedSubCategory(foundSub._id);
        } else {
          setSelectedSubCategory(null);
        }
      } else {
        setSelectedSubCategory(null);
      }
    }
  }, [searchParams, subCategories]);

  // Filter products by subcategory
  useEffect(() => {
    if (!selectedSubCategory) {
      setFilteredProducts(allProducts);
    } else {
      // Maintain priority sorting when filtering
      const filtered = allProducts.filter((p) => p.subCategory?._id === selectedSubCategory);
      setFilteredProducts(filtered);
    }
    // Reset showAllProducts when filter changes
    setShowAllProducts(false);
  }, [selectedSubCategory, allProducts]);

  // Handle filter change and update URL
  const handleFilterChange = (subCategoryId) => {
    if (subCategoryId === null) {
      // Remove query parameter
      const params = new URLSearchParams(searchParams.toString());
      params.delete('subCategory');
      const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
      window.history.pushState({}, '', newUrl);
    } else {
      const sub = subCategories.find(s => s._id === subCategoryId);
      if (sub) {
        const slug = toSlug(sub.name);
        const params = new URLSearchParams(searchParams.toString());
        params.set('subCategory', slug);
        const newUrl = `${pathname}?${params.toString()}`;
        window.history.pushState({}, '', newUrl);
      }
    }
  };

  const handleAddToCart = async (product) => {
    // Check if user is logged in
    if (!userId || !token) {
      toast.error("Please login to add products to cart");
      return;
    }

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

  // Check if we're on the main products page without any subcategory filter
  const isMainProductsPage = pathname === "/products" && !searchParams.get('subCategory');

  // Determine which products to display
  const displayProducts = showAllProducts ? filteredProducts : filteredProducts.slice(0, 8);

  return (
    <div className="min-h-screen   ">
      {/* Decorative top border */}
      
      
      <Toaster position="top-right" />

      <div className="max-w-8xl mx-auto px-4 py-8">
        
        {/* --- Header - Only show on main products page --- */}
        {isMainProductsPage && (
          <div className="text-center mb-12">
            <div className="inline-block bg-[#BB4D00] text-white px-6 py-2 rounded-full mb-4">
              <span className="font-bold">Premium Laddus & Delights</span>
            </div>
            <h1 className="text-5xl font-bold text-[#BB4D00] mb-4">Dadi ke Laddu Collection</h1>
            <p className="text-[#BB4D00]/80 max-w-2xl mx-auto text-lg">
              Handcrafted with love using traditional recipes passed down through generations. 
              Each Laddu is a celebration of flavor and heritage.
            </p>
            
            <div className="mt-8 flex justify-center">
              <div className="relative">
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {totalCartItems}
                </div>
                <Link href="/cart">
                  <div className="bg-[#BB4D00] p-4 rounded-full shadow-lg hover:bg-[#A04000] transition cursor-pointer flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6 text-white" />
                    <span className="text-white font-medium">View Cart</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* --- Filter --- */}
        <div className="bg-white rounded-2xl p-6 mb-10 shadow-sm border-2 border-[#BB4D00]/20">
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <div className="flex items-center gap-2 bg-[#BB4D00]/10 px-4 py-2 rounded-full">
              <Filter className="w-5 h-5 text-[#BB4D00]" />
              <span className="font-medium text-[#BB4D00]">Filter by Category:</span>
            </div>
            <button
              onClick={() => handleFilterChange(null)}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${
                selectedSubCategory === null
                  ? "bg-[#BB4D00] text-white shadow-md"
                  : "bg-white text-[#BB4D00] hover:bg-[#BB4D00]/5 border border-[#BB4D00]/20"
              }`}
            >
              All Laddus
            </button>
            {subCategories.map((sub) => (
              <button
                key={sub._id}
                onClick={() => handleFilterChange(sub._id)}
                className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${
                  selectedSubCategory === sub._id
                    ? "bg-[#BB4D00] text-white shadow-md"
                    : "bg-white text-[#BB4D00] hover:bg-[#BB4D00]/5 border border-[#BB4D00]/20"
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>

        {/* --- Products --- */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse border-2 border-[#BB4D00]/10">
                <div className="h-64 bg-[#BB4D00]/10"></div>
                <div className="p-5">
                  <div className="h-6 bg-[#BB4D00]/10 rounded mb-2"></div>
                  <div className="h-4 bg-[#BB4D00]/10 rounded w-3/4 mb-3"></div>
                  <div className="h-8 bg-[#BB4D00]/10 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto bg-[#BB4D00]/10 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-[#BB4D00]" />
            </div>
            <h3 className="text-2xl font-bold text-[#BB4D00] mb-2">No Laddus Found</h3>
            <p className="text-[#BB4D00]/70 max-w-md mx-auto">
              We couldn&apos;t find any Laddus in this category. Try selecting a different category.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {displayProducts.map((product) => {
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
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                      product.priorityNumber === 3 ? 'bg-gradient-to-r from-purple-600 to-indigo-600' :
                      product.priorityNumber === 2 ? 'bg-gradient-to-r from-blue-600 to-cyan-600' :
                      'bg-gradient-to-r from-green-600 to-emerald-600'
                    }`}>
                      {product.priorityNumber === 3 ? 'Best Seller' : 
                       product.priorityNumber === 2 ? 'Popular' : 
                       'New'}
                    </span>
                  </div>
                ) : null;

                // Discount badge
                const discountBadge = product.discount > 0 ? (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-red-500 to-orange-500">
                      {product.discount}% OFF
                    </span>
                  </div>
                ) : null;

                return (
                  <div
                    key={productId}
                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-[#BB4D00]/10"
                  >
                    <Link href={`/products/${product.name.replace(/\s+/g, '-').toLowerCase()}`}>
                      <div className="relative h-72 overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50">
                        {discountBadge}
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
                              <ShoppingBag className="w-12 h-12 text-[#BB4D00]/30 mx-auto" />
                              <p className="text-[#BB4D00]/30 mt-2">No Image</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="p-6 bg-gradient-to-b from-white to-orange-50">
                      <Link href={`/products/${product.name.replace(/\s+/g, '-').toLowerCase()}`}>
                        <h2 className="text-lg font-bold text-[#BB4D00] group-hover:text-[#A04000] transition-colors line-clamp-2 mb-2">
                          {product.name}
                        </h2>
                      </Link>
                      <p className="text-sm text-[#BB4D00]/70 mb-4">
                        {product.shortdescription}  
                      </p>
                      
                      <div className="flex items-baseline gap-2 mb-5">
                        <span className="text-2xl font-bold text-[#BB4D00]">
                          ₹{discountedPrice.toLocaleString()}
                        </span>
                        {product.discount > 0 && (
                          <span className="text-sm line-through text-[#BB4D00]/40">
                            ₹{product.price.toLocaleString()}
                          </span>
                        )}
                        <span className="text-xs bg-[#BB4D00]/10 text-[#BB4D00] px-2 py-1 rounded-full">
                          {product.weight}
                        </span>
                      </div>

                      {showControls ? (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border-2 border-[#BB4D00]/20 rounded-full overflow-hidden flex-1">
                            <button
                              onClick={() => handleQuantityChange(productId, -1)}
                              disabled={isUpdating}
                              className="px-4 py-3 bg-[#BB4D00]/5 hover:bg-[#BB4D00]/10 transition disabled:opacity-50 flex-1"
                            >
                              <Minus className="w-5 h-5 text-[#BB4D00] mx-auto" />
                            </button>
                            <span className="px-4 py-3 text-[#BB4D00] font-bold text-lg min-w-[3rem] text-center bg-[#BB4D00]/5 relative">
                              {quantities[productId] || 1}
                              {isUpdating && (
                                <span className="absolute inset-0 flex items-center justify-center bg-[#BB4D00]/5">
                                  <div className="w-5 h-5 border-2 border-[#BB4D00] border-t-transparent rounded-full animate-spin"></div>
                                </span>
                              )}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(productId, 1)}
                              disabled={isUpdating}
                              className="px-4 py-3 bg-[#BB4D00]/5 hover:bg-[#BB4D00]/10 transition disabled:opacity-50 flex-1"
                            >
                              <Plus className="w-5 h-5 text-[#BB4D00] mx-auto" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {!userId || !token ? (
                            <Link href="/login">
                              <button
                                className="w-full py-3 rounded-full font-bold flex items-center justify-center gap-2 shadow-lg transition-all bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl"
                              >
                                Login to Add
                              </button>
                            </Link>
                          ) : (
                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={cartLoading || isUpdating || product.stock === 0}
                              className={`w-full py-3 rounded-full font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
                                product.stock === 0
                                  ? "bg-[#BB4D00]/10 text-[#BB4D00]/50 cursor-not-allowed"
                                  : "bg-[#BB4D00] text-white hover:bg-[#A04000] hover:shadow-xl"
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
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* More/Less Button */}
            {filteredProducts.length > 8 && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setShowAllProducts(!showAllProducts)}
                  className="px-8 py-4 bg-[#BB4D00] text-white font-bold rounded-full shadow-lg hover:bg-[#A04000] hover:shadow-xl transition-all flex items-center justify-center gap-2 mx-auto"
                >
                  {showAllProducts ? (
                    <>
                      Show Less Products
                      <Minus className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      More Products
                      <Plus className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      
    </div>
  );
};

export default ProductsPage;