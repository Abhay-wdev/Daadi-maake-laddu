"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import DOMPurify from "dompurify";
import "../../../app/globals.css";

export default function BlogDetails() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/blogs/slug/${slug}`);
        const data = await res.json();
        console.log("Fetched blog data:", data);
        setBlog(data.data);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
      }
    };
    if (slug) fetchBlog();
  }, [slug]);

  if (!blog) return <p className="text-center py-10">Loading blog...</p>;

  // ✅ Clean and allow inline styles + images + links
  const cleanHTML = DOMPurify.sanitize(blog.htmlContent || "", {
    USE_PROFILES: { html: true },
    ALLOWED_ATTR: [
      "href",
      "src",
      "alt",
      "style",
      "class",
      "target",
      "width",
      "height",
      "dir",
      "data-*",
      "border",
    ],
    ALLOWED_TAGS: [
      "p",
      "span",
      "div",
      "a",
      "img",
      "ul",
      "ol",
      "li",
      "b",
      "i",
      "u",
      "strong",
      "em",
      "blockquote",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "br",
      "hr",
      "strike",
      "sub",
      "sup",
      "table",
      "tbody",
      "thead",
      "tr",
      "td",
      "th",
    ],
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Title */}
      <h1 className="text-4xl font-bold text-[#bb4d00] mb-3">{blog.title}</h1>
      <p className="text-gray-600 mb-6">
        By <span className="font-medium">{blog.author}</span> in{" "}
        <span className="italic">{blog.category}</span>
      </p>

      {/* Blog Image */}
      {blog.image && (
        <div className="relative w-full h-[400px] mb-8">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover rounded-2xl shadow-md"
          />
        </div>
      )}

      {/* ✅ Render full HTML safely */}
      <div
        className="prose prose-lg max-w-none text-gray-800 blog-content"
        dangerouslySetInnerHTML={{ __html: cleanHTML }}
      />
    </div>
  );
}
