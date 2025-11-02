"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BlogForm from "../../components/BlogForm";

export default function EditBlog() {
  const { id } = useParams();
   
  const router = useRouter();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetch(`https://dadimaabackend.onrender.com/api/blogs/${id}`)
      .then((res) => res.json())
      .then((data) => setBlog(data.data));
  }, [id]);

  const handleSubmit = async (form) => {
    const fd = new FormData();
    Object.keys(form).forEach((key) => fd.append(key, form[key]));

    const res = await fetch(`https://dadimaabackend.onrender.com/api/blogs/${id}`, {
      method: "PUT",
      body: fd,
    });

    if (res.ok) {
      alert("Blog updated successfully!");
      router.push("/admin/blogs");
    } else {
      alert("Failed to update blog.");
    }
  };

  if (!blog) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">Edit Blog</h1>
      <BlogForm initialData={blog} onSubmit={handleSubmit} />
    </div>
  );
}
