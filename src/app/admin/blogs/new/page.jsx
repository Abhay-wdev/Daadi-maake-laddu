"use client";
import React from "react";
import BlogForm from "../../components/BlogForm";

export default function CreateBlog() {
  const handleSubmit = async (form) => {
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("author", form.author);
      fd.append("category", form.category);
      fd.append("tags", form.tags);
      fd.append("isPublished", form.isPublished);
      fd.append("htmlContent", form.htmlContent);

      // Store content as JSON (Editor.js compatible)
      fd.append(
        "content",
        JSON.stringify({
          time: Date.now(),
          blocks: [{ type: "paragraph", data: { text: form.htmlContent } }],
        })
      );

      if (form.image) fd.append("image", form.image);

      const res = await fetch("http://localhost:5000/api/blogs", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("✅ Blog created successfully!");
      } else {
        alert("❌ Failed: " + (data.message || "Unknown error"));
        console.error("Response:", data);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong. Check console.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-semibold mb-6 text-[#BB4D00]">📝 Create Blog</h1>
      <BlogForm onSubmit={handleSubmit} />
    </div>
  );
}
