"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductDetails from "../../components/ProductDetails";
import axios from "axios";

const ProductPage = () => {
  const { ProductSlug } = useParams(); // get slug from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/slug/${ProductSlug}`);
        setProduct(data.data); // the product object is inside data.data
      } catch (err) {
        console.error(err);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    if (ProductSlug) fetchProduct();
  }, [ProductSlug]);

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading product...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;

  return <ProductDetails product={product} />;
};

export default ProductPage;
