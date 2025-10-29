"use client";
import React, { useEffect, useState } from "react";
import { Clock, Package, Share2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

const ProductMore = ({ params }) => {
  const router = useRouter();
  const { ProductSlug } = params; // ✅ Get slug from dynamic route

  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!ProductSlug) return;

    // Fetch product details using slug
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${ProductSlug}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Failed to load product:", err);
      }
    };

    fetchProduct();
  }, [ProductSlug]);

  if (!product) {
    return (
      <div className="text-center text-gray-500 py-12">
        Loading product details...
      </div>
    );
  }

  // ✅ Share button handler
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this product: ${product.name}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      // fallback copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
        <button
          onClick={handleShare}
          className="p-2 rounded-full bg-gray-100 hover:bg-orange-100 text-gray-600 hover:text-orange-600 transition-all shadow-sm"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Storage & Allergen Info */}
      {(product.shelfLife || product.storageInstructions || product.allergenInfo) && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 mb-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            Storage & Ingredients Info
          </h3>
          <div className="space-y-3">
            {product.shelfLife && (
              <div className="flex items-start text-sm">
                <span className="text-gray-600 w-28">Shelf Life</span>
                <span className="font-medium">{product.shelfLife}</span>
              </div>
            )}
            {product.storageInstructions && (
              <div className="flex items-start text-sm">
                <span className="text-gray-600 w-28">Storage</span>
                <span className="font-medium">{product.storageInstructions}</span>
              </div>
            )}
            {product.allergenInfo && (
              <div className="flex items-start text-sm">
                <span className="text-gray-600 w-28">Allergens</span>
                <span className="font-medium flex items-center">
                  <AlertTriangle className="w-4 h-4 text-green-500 mr-1" />
                  {product.allergenInfo}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Nutritional Information */}
      {product.nutritionalInfo && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-orange-500" />
            Nutritional Information
          </h3>
          <div className="space-y-3">
            {product.nutritionalInfo.per && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Per</span>
                <span className="font-medium">{product.nutritionalInfo.per}</span>
              </div>
            )}
            {Array.isArray(product.nutritionalInfo.values) &&
              product.nutritionalInfo.values.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between text-sm border-b border-orange-100 pb-2"
                >
                  <span className="text-gray-600 capitalize">{item.name}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
          </div>
        </div>
      )}
     
    </div>
  );
};

export default ProductMore;
