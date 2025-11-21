"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";

/* 🧩 Convert Editor.js content to HTML */
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
          return `<blockquote class="border-l-4 border-[#B24D00] pl-4 italic text-gray-600 mb-3">"${block.data.text}"</blockquote>`;
        default:
          return "";
      }
    })
    .join("");
};

/* 🧠 Detect both HTML or Editor.js JSON */
const renderBlogContent = (content) => {
  try {
    const parsed = typeof content === "string" ? JSON.parse(content) : content;
    if (parsed && parsed.blocks) return renderEditorContent(parsed);
  } catch {
    return content;
  }
  return "";
};

/* 🌐 Main Blog Component */
const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const pathname = usePathname();
  const isBlogPage = pathname.includes("/blogs");

  /* ✅ Fetch Blogs */
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs`);
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
      <section className="bg-[#FFF9EC] py-20">
        <div className="flex justify-center items-center min-h-[40vh] text-gray-700 text-lg">
          Loading stories from Daadimaa’s kitchen...
        </div>
      </section>
    );

  /* 🧮 Pagination setup */
  const blogsPerPage = 9;
  const totalPages = Math.ceil(blogs.length / blogsPerPage);
  const startIndex = (currentPage - 1) * blogsPerPage;
  const currentBlogs = blogs.slice(startIndex, startIndex + blogsPerPage);

  /* 🧮 Carousel setup (for homepage or non /blogs routes) */
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

  /* 🎬 Page transition variants */
  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
    exit: (dir) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      transition: { duration: 0.6, ease: "easeIn" },
    }),
  };

  return (
    <section className="bg-[#FFF9EC] py-16 md:py-20 overflow-hidden font-['Inter']">
      <div className="max-w-7xl mx-auto px-4">
        <Head>
          <title>
            Dadi Maa Ke Laddu Blog – Traditional Recipes, Pure Ghee Benefits &
            Indian Culture
          </title>
          <meta
            name="description"
            content="Explore heartwarming stories, homemade laddu recipes, pure ghee benefits, festive inspirations, and dadi maa ke timeless nuskhe. A blog where taste meets tradition."
          />
          <meta
            name="keywords"
            content="dadi maa ke laddu blog, laddu recipes, pure ghee benefits, indian sweets blog, festive desserts, dadi maa ke nuskhe, homemade ladoo"
          />
          <link rel="canonical" href="https://dadimaakeladdu.com/blogs" />
          <meta name="robots" content="index, follow" />
          <meta name="author" content="Dadi Maa Ke Laddu Team" />
          <meta name="publisher" content="Dadi Maa Ke Laddu" />
        </Head>

        {/* 🍥 Top Section – Hero + Intro */}
        <div className="text-center mb-12 md:mb-16">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full mb-4 shadow-sm border border-[#F3D0A2]"
            style={{ backgroundColor: "#B24D00" }}
          >
            <span className="w-2 h-2 rounded-full bg-yellow-300" />
            <span className="text-xs md:text-sm font-semibold text-white tracking-wide uppercase">
              Stories • Tradition • Taste
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#B24D00] mb-4 leading-tight">
            Daadimaa’s Blog – Tales From The Ghee-Ki-Factory
          </h2>

          {/* Subtext */}
          <p className="max-w-3xl mx-auto text-base md:text-lg leading-relaxed text-gray-700">
            From{" "}
            <span className="font-semibold text-[#B24D00]">
              garam-garam laddu recipes
            </span>{" "}
            to{" "}
            <span className="font-semibold text-[#B24D00]">
              pure ghee health tips
            </span>{" "}
            and{" "}
            <span className="font-semibold text-[#B24D00]">
              festive mithai inspirations
            </span>
            — this is where dadi maa ke nuskhe, emotions, and Indian food
            culture come together in one sweet space.
          </p>
        </div>

        {/* 🌟 Featured / Highlighted Layout – For Blog Listing */}
        {blogs.length > 0 && isBlogPage && (
          <div className="mb-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Featured Blog (1st) */}
            {blogs[0] && (
              <motion.article
                className="lg:col-span-7 rounded-3xl overflow-hidden shadow-lg border border-[#f1efeb] bg-white group"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                itemScope
                itemType="https://schema.org/BlogPosting"
              >
                {blogs[0].image && (
                  <div className="relative h-64 md:h-80 overflow-hidden">
                    <img
                      src={blogs[0].image}
                      alt={blogs[0].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-left text-white">
                      <p className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur">
                        {blogs[0].category || "Featured Story"}
                      </p>
                      <h3 className="mt-2 text-2xl md:text-3xl font-bold leading-snug drop-shadow-sm">
                        {blogs[0].title}
                      </h3>
                    </div>
                  </div>
                )}
                <div className="p-5 md:p-6">
                  <p className="text-xs uppercase tracking-wide text-[#B24D00] font-semibold mb-2">
                    Featured • Daadimaa Recommends
                  </p>
                  <div
                    className="text-sm md:text-base text-gray-700 mb-4 line-clamp-4"
                    dangerouslySetInnerHTML={{
                      __html: renderBlogContent(blogs[0].htmlContent),
                    }}
                  />
                  <Link
                    href={blogs[0].slug ? `/blogs/${blogs[0].slug}` : "#"}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#B24D00] hover:text-[#7F3400] transition-colors"
                  >
                    Read this story →
                  </Link>
                </div>
              </motion.article>
            )}

            {/* Side Smaller Highlights */}
            <div className="lg:col-span-5 grid grid-cols-1 gap-5   ">
              {blogs.slice(1, 4).map((post, idx) => (
                <motion.article
                  key={post._id}
                  className="rounded-2xl overflow-hidden shadow-md border border-[#f9f6f0] bg-white flex gap-4 group"
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.25 }}
                >
                  {post.image && (
                    <div className="w-32 h-28 flex-shrink-0 overflow-hidden relative">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                  <div className="py-3 pr-4 flex flex-col justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-[#B24D00] font-semibold mb-1">
                        {post.category || "Laddu Story"}
                      </p>
                      <h4 className="text-sm md:text-base font-semibold text-gray-800 mb-1 line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {/* Short preview */}
                        <span
                          dangerouslySetInnerHTML={{
                            __html:
                              renderBlogContent(post.htmlContent)
                                ?.slice(0, 100) + "...",
                          }}
                        />
                      </p>
                    </div>
                    <Link
                      href={post.slug ? `/blogs/${post.slug}` : "#"}
                      className="text-xs font-semibold text-[#B24D00] hover:text-[#7F3400] mt-1 inline-flex items-center"
                    >
                      Read more →
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        )}

        {/* 📰 Blog Grid or Carousel */}
        {isBlogPage ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.12 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {shownBlogs.map((post, i) => (
              <BlogCard key={post._id} post={post} index={i} />
            ))}
          </motion.div>
        ) : (
          <div className="relative mt-10">
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
                {shownBlogs.map((post, i) => (
                  <BlogCard key={post._id} post={post} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* 📑 Pagination (only on /blogs) */}
        {isBlogPage && totalPages > 1 && (
          <div className="flex justify-center mt-12 space-x-2">
            <PaginationButton
              label="‹"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            />
            {[...Array(totalPages)].map((_, i) => (
              <PaginationButton
                key={i}
                label={i + 1}
                active={currentPage === i + 1}
                onClick={() => setCurrentPage(i + 1)}
              />
            ))}
            <PaginationButton
              label="›"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            />
          </div>
        )}

        {/* 🔁 Carousel Controls (Home/other pages) */}
        {!isBlogPage && blogs.length > 3 && (
          <div className="flex justify-center mt-10 space-x-4">
            <button
              onClick={prevSlide}
              disabled={carouselIndex === 0}
              className={`px-6 py-2 rounded-full text-white font-medium transition ${
                carouselIndex === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#B24D00] hover:bg-[#7F3400]"
              }`}
            >
              ← Previous
            </button>
            <button
              onClick={nextSlide}
              disabled={carouselIndex + 3 >= blogs.length}
              className={`px-6 py-2 rounded-full text-white font-medium transition ${
                carouselIndex + 3 >= blogs.length
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#B24D00] hover:bg-[#7F3400]"
              }`}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

/* ♻️ Blog Card – Dadimaa Styled */
const BlogCard = ({ post, index }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: index * 0.07,
      },
    },
  };

  return (
    <motion.article
      variants={cardVariants}
      className="rounded-3xl overflow-hidden shadow-md bg-amber-50 hover:shadow-2xl transition duration-300    group relative"
      itemScope
      itemType="https://schema.org/BlogPosting"
      whileHover={{ y: -6 }}
    >
      {post.image && (
        <div className="relative h-52 md:h-56 overflow-hidden">
          <motion.img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/80 text-[#B24D00]">
              {post.category || "Laddu Stories"}
            </span>
          </div>
        </div>
      )}

      <div className="p-5 md:p-6">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {post.title}
        </h3>

        <div
          className="text-sm text-gray-700 mb-4 prose prose-sm max-w-none line-clamp-4"
          dangerouslySetInnerHTML={{
            __html: renderBlogContent(post.htmlContent),
          }}
        />

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#eeeae2]">
          <span className="text-xs text-gray-500 italic">
            A sweet read from Daadimaa’s kitchen
          </span>
          <Link
            href={post.slug ? `/blogs/${post.slug}` : "#"}
            className="inline-flex items-center text-sm font-semibold text-[#B24D00] hover:text-[#7F3400] transition"
          >
            Explore story →
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

/* ♻️ Pagination Button */
const PaginationButton = ({ label, disabled, active, onClick }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition ${
      disabled
        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
        : active
        ? "bg-[#B24D00] text-white shadow"
        : "text-gray-700 hover:bg-[#F3D0A2]"
    }`}
  >
    {label}
  </button>
);

export default Blog;
