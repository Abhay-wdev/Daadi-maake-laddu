"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// 🧩 Convert Editor.js blocks to HTML
const renderEditorContent = (content) => {
  if (!content || !content.blocks) return "";

  return content.blocks
    .map((block) => {
      switch (block.type) {
        case "paragraph":
          return `<p class="mb-3">${block.data.text}</p>`;
        case "header":
          return `<h${block.data.level} class="font-semibold text-gray-800 mb-2">${block.data.text}</h${block.data.level}>`;
        case "list":
          const items = block.data.items
            .map((item) => `<li class="ml-5 list-disc">${item}</li>`)
            .join("");
          return `<ul class="mb-3">${items}</ul>`;
        case "quote":
          return `<blockquote class="border-l-4 border-[#BB4D00] pl-4 italic text-gray-600 mb-3">"${block.data.text}"</blockquote>`;
        default:
          return "";
      }
    })
    .join("");
};

// 🧠 Detect and handle both HTML or Editor.js JSON
const renderBlogContent = (content) => {
  try {
    const parsed = typeof content === "string" ? JSON.parse(content) : content;
    if (parsed && parsed.blocks) return renderEditorContent(parsed);
  } catch (e) {
    return content;
  }
  return "";
};

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const pathname = usePathname();
  const isBlogPage = pathname.includes("/blogs");

  // ✅ Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("https://dadimaabackend-2.onrender.com/api/blogs");
        const data = await res.json();
        if (data.success) setBlogs(data.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg">
        Loading blogs...
      </div>
    );

  // 🧮 Pagination setup (for /blogs)
  const blogsPerPage = 9;
  const totalPages = Math.ceil(blogs.length / blogsPerPage);
  const startIndex = (currentPage - 1) * blogsPerPage;
  const currentBlogs = blogs.slice(startIndex, startIndex + blogsPerPage);

  // 🧮 Carousel setup (for homepage or non-/blogs)
  const visibleBlogs = blogs.slice(carouselIndex, carouselIndex + 3);

  const nextSlide = () => {
    if (carouselIndex + 3 < blogs.length) {
      setDirection(1);
      setCarouselIndex(carouselIndex + 3);
    }
  };

  const prevSlide = () => {
    if (carouselIndex > 0) {
      setDirection(-1);
      setCarouselIndex(carouselIndex - 3);
    }
  };

  const shownBlogs = isBlogPage ? currentBlogs : visibleBlogs;

  // 🎬 Animation variants
  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: (dir) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      transition: { duration: 0.6, ease: "easeIn" },
    }),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 font-['Inter'] bg-gray-50 min-h-screen overflow-hidden">
      {/* ✅ BLOG GRID */}
      {isBlogPage ? (
        // Default blogs page with pagination (no animation)
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {shownBlogs.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        // Carousel with smooth animation
        <div className="relative">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={carouselIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {shownBlogs.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* ✅ PAGINATION (only on /blogs) */}
      {isBlogPage && totalPages > 1 && (
        <div className="flex justify-center mt-12 space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`w-9 h-9 flex items-center justify-center rounded-full ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#BB4D00] text-white hover:bg-[#933900]"
            }`}
          >
            &lt;
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-9 h-9 flex items-center justify-center rounded-full font-medium transition ${
                currentPage === i + 1
                  ? "bg-[#BB4D00] text-white shadow"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`w-9 h-9 flex items-center justify-center rounded-full ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#BB4D00] text-white hover:bg-[#933900]"
            }`}
          >
            &gt;
          </button>
        </div>
      )}

      {/* ✅ LEFT/RIGHT BUTTONS (only when not /blogs) */}
      {!isBlogPage && (
        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={prevSlide}
            disabled={carouselIndex === 0}
            className={`px-5 py-2 rounded-full text-white font-medium transition ${
              carouselIndex === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#BB4D00] hover:bg-[#933900]"
            }`}
          >
            ← Previous
          </button>

          <button
            onClick={nextSlide}
            disabled={carouselIndex + 3 >= blogs.length}
            className={`px-5 py-2 rounded-full text-white font-medium transition ${
              carouselIndex + 3 >= blogs.length
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#BB4D00] hover:bg-[#933900]"
            }`}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

// ♻️ Reusable Blog Card
const BlogCard = ({ post }) => (
  <div className="rounded-xl overflow-hidden shadow-md bg-white hover:shadow-xl transition duration-300 border border-gray-100">
    {post.image && (
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-56 object-cover"
      />
    )}
    <div className="p-5">
      <p className="text-xs text-[#BB4D00] font-semibold uppercase tracking-wide mb-2">
        {post.category || "Uncategorized"}
      </p>

      <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
        {post.title}
      </h3>

      <div
        className="text-sm text-gray-700 mb-4 prose prose-sm max-w-none line-clamp-4"
        dangerouslySetInnerHTML={{
          __html: renderBlogContent(post.htmlContent),
        }}
      />

      <Link
        href={post.slug ? `/blogs/${post.slug}` : "#"}
        className="inline-block mt-2 text-sm font-medium text-[#BB4D00] hover:text-[#933900] transition"
      >
        Read more →
      </Link>
    </div>
  </div>
);

export default Blog;
