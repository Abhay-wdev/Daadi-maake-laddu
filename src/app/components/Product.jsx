'use client';
import React, { useEffect, useState } from "react";
import { useProductStore } from "../../store/ProductStore"; // adjust path
import { useCategoryStore } from "../../store/CategoryStore"; // optional: fetch categories
import { useSubCategoryStore } from "../../store/useSubCategoryStore"; // optional: fetch subcategories
import { Search, Plus, Edit2, Trash2, Power, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";



export default function ProductManagement() {

const categoryId= useParams().slug;
const subcategoryId= useParams().Slug;
console.log(categoryId+ subcategoryId)

  const {
    products,
    fetchProducts,
    deleteProduct,
    loading,
    createProduct,
    updateProduct,
  } = useProductStore();

  const { categories, fetchCategories } = useCategoryStore(); 
  const { subCategories, fetchSubCategories } = useSubCategoryStore(); 

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    shortdescription: "",
    category: "",
    subCategory: "",
    price: "",
    images: [],
  });
  const [imagePreview, setImagePreview] = useState([]);

  // Fetch initial data
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSubCategories();
  }, []);

  // Fetch filtered products
  useEffect(() => {
    fetchProducts({
      search: searchTerm,
      categoryId: selectedCategory || null,
      subCategoryId: selectedSubCategory || null,
    });
  }, [searchTerm, selectedCategory, selectedSubCategory]);

  // Handle input change
  const handleChange = (e) => {
    if (e.target.name === "images") {
      const files = Array.from(e.target.files);
      setForm({ ...form, images: files });
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreview(previews);
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in form) {
      if (key === "images") {
        form.images.forEach(img => formData.append("images", img));
      } else {
        formData.append(key, form[key]);
      }
    }

    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, formData);
        toast.success("Product updated successfully");
      } else {
        await createProduct(formData);
        toast.success("Product created successfully");
      }
      setForm({
        name: "",
        description: "",
        shortdescription: "",
        category: "",
        subCategory: "",
        price: "",
        images: [],
      });
      setImagePreview([]);
      setShowForm(false);
      setEditingProduct(null);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      shortdescription: product.shortdescription,
      category: product.category?._id || "",
      subCategory: product.subCategory?._id || "",
      price: product.price,
      images: [],
    });
    setImagePreview(product.images || []);
    setShowForm(true);
  };

  // Delete product
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            <select
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Subcategories</option>
              {subCategories
                .filter(sub => !selectedCategory || sub.category === selectedCategory)
                .map(sub => (
                  <option key={sub._id} value={sub._id}>{sub.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>

        {/* Product Form */}
        {showForm && (
          <div className="mb-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} className="px-4 py-2 rounded-lg border border-gray-300" />
              <input name="shortdescription" placeholder="Short Description" value={form.shortdescription} onChange={handleChange} className="px-4 py-2 rounded-lg border border-gray-300" />
              <input name="description" placeholder="Description" value={form.description} onChange={handleChange} className="px-4 py-2 rounded-lg border border-gray-300 col-span-2" />
              <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} className="px-4 py-2 rounded-lg border border-gray-300" />
              <select name="category" value={form.category} onChange={handleChange} className="px-4 py-2 rounded-lg border border-gray-300">
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
              </select>
              <select name="subCategory" value={form.subCategory} onChange={handleChange} className="px-4 py-2 rounded-lg border border-gray-300">
                <option value="">Select Subcategory</option>
                {subCategories.filter(sub => sub.category === form.category).map(sub => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
              </select>
              <div className="col-span-2">
                <label className="block mb-2 font-medium">Images</label>
                <input type="file" name="images" multiple onChange={handleChange} />
                <div className="flex gap-2 mt-2">
                  {imagePreview.map((img, i) => <img key={i} src={img} className="w-20 h-20 object-cover rounded-lg border" />)}
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                {editingProduct ? "Update Product" : "Create Product"}
              </button>
              <button onClick={() => { setShowForm(false); setEditingProduct(null); }} className="border px-4 py-2 rounded-lg">Cancel</button>
            </div>
          </div>
        )}

        {/* Product List */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <div key={product._id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <img src={product.images[0]} alt={product.name} className="w-full h-40 object-cover rounded-md mb-2" />
                <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                <p className="text-gray-500 text-sm truncate">{product.shortdescription}</p>
                <p className="font-semibold mt-1">₹{product.price}</p>
                <p className={`text-sm mt-1 ${product.availabilityStatus === "In Stock" ? "text-green-600" : "text-red-600"}`}>
                  {product.availabilityStatus}
                </p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleEdit(product)} className="flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-2 py-1 rounded-lg flex items-center justify-center gap-1">
                    <Edit2 size={16} /> Edit
                  </button>
                  <button onClick={() => handleDelete(product._id)} className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded-lg flex items-center justify-center gap-1">
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
