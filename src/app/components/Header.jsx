"use client";

import React, { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa6";
import ProfileIcon from "./ProfileIcon";
import LoginSignupButton from "./LoginSignupButton";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuItems, setMenuItems] = useState([
    { title: "Home", href: "/" },
    { title: "Products", href: "/products" },
    { title: "About", href: "/about-us" },
    { title: "Blogs", href: "/blogs" },
  ]);

  const pathname = usePathname();
  const fetchedRef = useRef(false);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Check token in React state (memory storage)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }
  }, [pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchProducts = async () => {
      try {
        // Check if we already have data in memory
        const savedData = sessionStorage.getItem("navbarProducts");
        if (savedData) {
          const grouped = JSON.parse(savedData);
          updateMenuItems(grouped);
          return;
        }

        // Fetch from API if no local data found
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/all/?limit=100`
        );
        const data = await res.json();

        // Group products by subCategory
        const grouped = {};
        data.products.forEach((product) => {
          const subCatName = product.subCategory?.name || "Others";
          if (!grouped[subCatName]) grouped[subCatName] = [];
          grouped[subCatName].push({
            title: product.name,
            href: `/products/${product.slug}`,
          });
        });

        // Save the grouped data to sessionStorage for reuse
        sessionStorage.setItem("navbarProducts", JSON.stringify(grouped));

        // Update state
        updateMenuItems(grouped);
      } catch (err) {
        console.error("Navbar fetch error:", err);
      }
    };

    const updateMenuItems = (grouped) => {
      const subCategoryMenu = Object.keys(grouped).map((subCatName) => ({
        title: subCatName,
        submenu: grouped[subCatName],
      }));
      setMenuItems((prev) => {
        const newMenu = [...prev];
        newMenu.splice(1, 0, ...subCategoryMenu);
        return newMenu;
      });
    };

    fetchProducts();
  }, []);

  const toggleSubmenu = (title) => {
    setActiveSubmenu(activeSubmenu === title ? null : title);
  };

  const handleMobileMenuClose = () => {
    setIsOpen(false);
    setActiveSubmenu(null);
  };

  const QuickContactButtons = () => (
    <div className="flex items-center gap-2 sm:gap-3">
      <Link
        href="tel:+916378362945"
        className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-green-400 to-green-500 
                 rounded-full hover:from-green-500 hover:to-green-600 transition-all duration-300 shadow-md hover:shadow-lg
                 active:scale-95"
        aria-label="Call us"
      >
        <Phone size={18} className="text-white sm:w-5 sm:h-5" />
      </Link>
      <Link
        href="https://wa.me/+916378362945"
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-400 to-emerald-500 
                 rounded-full hover:from-emerald-500 hover:to-emerald-600 transition-all duration-300 shadow-md hover:shadow-lg
                 active:scale-95"
        aria-label="WhatsApp us"
      >
        <FaWhatsapp size={18} className="text-white sm:w-5 sm:h-5" />
      </Link>
    </div>
  );

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-16 sm:h-18 md:h-20">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.webp"
                  alt="Company Logo"
                  className="h-14 sm:h-16 md:h-20 w-auto"
                  width={100}
                  height={100}
                  priority
                />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex xl:space-x-8 lg:space-x-4 items-center">
              {menuItems.map((item) => (
                <div key={item.title} className="relative group">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={`flex items-center font-medium transition-colors duration-200 hover:text-[#BB4D00] py-2 px-1 ${
                        pathname === item.href ? "text-[#BB4D00]" : "text-gray-700"
                      }`}
                    >
                      {item.title}
                      {item.submenu && (
                        <ChevronDown className="ml-1 w-4 h-4 transform transition-transform duration-300 group-hover:rotate-180" />
                      )}
                    </Link>
                  ) : (
                    <span className="flex items-center font-medium text-gray-700 cursor-pointer hover:text-[#BB4D00] py-2 px-1 transition-colors duration-200">
                      {item.title}
                      {item.submenu && (
                        <ChevronDown className="ml-1 w-4 h-4 transform transition-transform duration-300 group-hover:rotate-180" />
                      )}
                    </span>
                  )}

                  {item.submenu && (
                    <div
                      className="absolute left-0 mt-1 w-56 bg-white shadow-xl rounded-lg 
                                    opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                                    transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300
                                    max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                    >
                      <div className="py-2">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.title}
                            href={subItem.href}
                            className={`block px-4 py-3 text-sm hover:text-[#BB4D00] hover:bg-gray-50 transition-colors duration-150 ${
                              pathname === subItem.href
                                ? "text-[#BB4D00] bg-gray-50"
                                : "text-gray-600"
                            }`}
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="hidden md:flex">
                <QuickContactButtons />
              </div>

              {isLoggedIn ? <ProfileIcon /> : <LoginSignupButton />}
            </div>

            {/* Mobile/Tablet Right Section */}
            <div className="lg:hidden flex items-center gap-2 sm:gap-3">
              <QuickContactButtons />
              
              {/* Show ProfileIcon when logged in, LoginSignupButton when not logged in */}
              {isLoggedIn ? (
                <div className="relative z-[60]">
                  <ProfileIcon />
                </div>
              ) : (
                <LoginSignupButton />
              )}
              
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-[#BB4D00] transition-colors duration-200 p-2 active:scale-95"
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile/Tablet Menu - Separate from nav for better z-index control */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm lg:hidden z-40"
            style={{ top: "64px" }}
            onClick={handleMobileMenuClose}
          />

          {/* Menu Content */}
          <div
            ref={mobileMenuRef}
            className="lg:hidden fixed left-0 right-0 bg-white shadow-2xl z-50 transition-all duration-300 ease-in-out"
            style={{ top: "64px", maxHeight: "calc(100vh - 64px)" }}
          >
            <div className="overflow-y-auto max-h-[calc(100vh-64px)] py-4 px-4 sm:px-6">
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <div key={item.title} className="border-b border-gray-100 last:border-0">
                    {!item.submenu ? (
                      item.href ? (
                        <Link
                          href={item.href}
                          className={`block py-3 sm:py-4 font-medium transition-colors duration-200 ${
                            pathname === item.href
                              ? "text-[#BB4D00]"
                              : "text-gray-700 hover:text-[#BB4D00]"
                          }`}
                          onClick={handleMobileMenuClose}
                        >
                          {item.title}
                        </Link>
                      ) : (
                        <span className="block py-3 sm:py-4 font-medium text-gray-700">
                          {item.title}
                        </span>
                      )
                    ) : (
                      <div>
                        <button
                          className={`flex justify-between items-center w-full py-3 sm:py-4 font-medium transition-colors duration-200 ${
                            activeSubmenu === item.title
                              ? "text-[#BB4D00]"
                              : "text-gray-700 hover:text-[#BB4D00]"
                          }`}
                          onClick={() => toggleSubmenu(item.title)}
                        >
                          <span>{item.title}</span>
                          <ChevronDown
                            className={`w-5 h-5 transform transition-transform duration-300 ${
                              activeSubmenu === item.title ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            activeSubmenu === item.title
                              ? "max-h-96 opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="pl-4 space-y-1 pb-2">
                            {item.submenu.map((subItem) => (
                              <Link
                                key={subItem.title}
                                href={subItem.href}
                                className={`block py-2.5 sm:py-3 text-sm transition-colors duration-200 ${
                                  pathname === subItem.href
                                    ? "text-[#BB4D00] font-medium"
                                    : "text-gray-600 hover:text-[#BB4D00]"
                                }`}
                                onClick={handleMobileMenuClose}
                              >
                                {subItem.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;