"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function BlogDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Base API URL (you can move this to a separate config file if reused)
  const API_BASE_URL = "https://ecom-backend-4-ysxq.onrender.com/api";

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/blogs`);
      setBlogs(res.data.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a blog
  const deleteBlog = async (id) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/blogs/${id}`);
      setBlogs((prevBlogs) => prevBlogs.filter((b) => b._id !== id));
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading blogs...</p>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Blog Management</h1>
        <Link
          href="/admin/blogs/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + New Blog
        </Link>
      </div>

      {blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="border rounded-xl p-4 shadow-sm bg-white"
            >
              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
              )}
              <h2 className="font-bold text-lg">{blog.title}</h2>
              <p className="text-sm text-gray-500 mb-2">
                {blog.author} • {new Date(blog.createdAt).toLocaleDateString()}
              </p>
              <p
                className="text-gray-700 line-clamp-3 text-sm"
                dangerouslySetInnerHTML={{
                  __html:
                    blog.htmlContent?.slice(0, 150) ||
                    blog.content?.blocks?.[0]?.data?.text ||
                    "",
                }}
              />
              <div className="flex justify-between mt-4">
                <Link
                  href={`/admin/blogs/${blog._id}`}
                  className="text-blue-600 text-sm"
                >
                  ✏️ Edit
                </Link>
                <button
                  onClick={() => deleteBlog(blog._id)}
                  className="text-red-500 text-sm"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
