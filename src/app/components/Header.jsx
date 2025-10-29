"use client";

import React, { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa6";
import ProfileIcon from "./ProfileIcon";
import LoginSignupButton from "./LoginSignupButton"; // your alternative component

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuItems, setMenuItems] = useState([
    { title: "Home", href: "/" },
    { title: "Blogs", href: "/blog" },
  ]);

  const pathname = usePathname();
  const fetchedRef = useRef(false); // ✅ to prevent double fetch in dev

  useEffect(() => {
    window.scrollTo(0, 0);

    // Check token in localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }
  }, [pathname]);

  useEffect(() => {
    if (fetchedRef.current) return; // ✅ skip if already fetched
    fetchedRef.current = true;

    // Fetch subcategories and products for the navbar
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products/all/?limit=100");
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

        // Convert grouped object into menuItems format
        const subCategoryMenu = Object.keys(grouped).map((subCatName) => ({
          title: subCatName,
          submenu: grouped[subCatName],
        }));

        // Insert at the place of second item (after Home)
        setMenuItems((prev) => {
          const newMenu = [...prev];
          newMenu.splice(1, 0, ...subCategoryMenu);
          return newMenu;
        });
      } catch (err) {
        console.error("Navbar fetch error:", err);
      }
    };

    fetchProducts();
  }, []);

  const toggleSubmenu = (title) => {
    setActiveSubmenu(activeSubmenu === title ? null : title);
  };

  const ContactInfo = ({ className = "" }) => (
    <div className={`flex items-center ${className}`}>
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-2 rounded-lg">
        <div className="flex items-center gap-2">
          <Phone size={14} className="text-indigo-600 shrink-0" />
          <span className="text-xs text-gray-500 whitespace-nowrap">For Consultation:</span>
          <a
            href="tel:+916378362945"
            className="text-sm text-gray-800 hover:text-indigo-600 transition-colors"
          >
            +91 6378362945
          </a>
        </div>
      </div>
    </div>
  );

  const QuickContactButtons = () => (
    <div className="flex items-center md:hidden gap-2">
      <a
        href="tel:+916378362945"
        className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 
                 rounded-full hover:from-green-500 hover:to-green-600 transition-all"
      >
        <Phone size={16} className="text-white" />
      </a>
      <a
        href="https://wa.me/+916378362945"
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-emerald-400 to-emerald-500 
                 rounded-full hover:from-emerald-500 hover:to-emerald-600 transition-all"
      >
        <FaWhatsapp size={16} className="text-white" />
      </a>
    </div>
  );

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/logo.webp"
                alt="Company Logo"
                className="h-20"
                width={100}
                height={100}
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-6 items-center">
            {menuItems.map((item) => (
              <div key={item.title} className="relative group">
                {item.href ? (
                  <Link
                    href={item.href}
                    className={`flex items-center font-medium transition-colors hover:text-indigo-600 ${
                      pathname === item.href ? "text-indigo-600" : "text-gray-700"
                    }`}
                  >
                    {item.title}
                    {item.submenu && (
                      <ChevronDown className="ml-1 w-4 h-4 transform transition-transform group-hover:rotate-180" />
                    )}
                  </Link>
                ) : (
                  <span className="flex items-center font-medium text-gray-700 cursor-pointer hover:text-indigo-600">
                    {item.title}
                    {item.submenu && (
                      <ChevronDown className="ml-1 w-4 h-4 transform transition-transform group-hover:rotate-180" />
                    )}
                  </span>
                )}

                {item.submenu && (
                  <div
                    className="absolute left-0 mt-2 w-56 bg-white/90 shadow-xl rounded-lg 
                                  opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                                  transform -translate-y-2 group-hover:translate-y-0 transition-all"
                  >
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.title}
                        href={subItem.href}
                        className={`block px-4 py-3 text-sm hover:text-indigo-600 hover:bg-gray-50 ${
                          pathname === subItem.href ? "text-indigo-600 bg-gray-50" : "text-gray-600"
                        }`}
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <ContactInfo className="hidden lg:flex" />
            <QuickContactButtons />

            {/* Conditional rendering */}
            {isLoggedIn ? <ProfileIcon /> : <LoginSignupButton />}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-4">
            <QuickContactButtons />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-indigo-600"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden bg-white/90 backdrop-blur-md transition-all overflow-hidden ${
            isOpen ? "max-h-screen" : "max-h-0"
          }`}
        >
          <div className="py-4 space-y-2 px-4">
            {menuItems.map((item) => (
              <div key={item.title}>
                {!item.submenu ? (
                  item.href ? (
                    <Link
                      href={item.href}
                      className={`block py-2 font-medium ${
                        pathname === item.href ? "text-indigo-600" : "text-gray-700"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ) : (
                    <span className="block py-2 font-medium text-gray-700">{item.title}</span>
                  )
                ) : (
                  <div>
                    <button
                      className={`flex justify-between w-full py-2 font-medium ${
                        activeSubmenu === item.title ? "text-indigo-600" : "text-gray-700"
                      }`}
                      onClick={() => toggleSubmenu(item.title)}
                    >
                      {item.title}
                      <ChevronDown
                        className={`w-4 h-4 transform transition-transform ${
                          activeSubmenu === item.title ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`pl-4 space-y-1 overflow-hidden transition-all ${
                        activeSubmenu === item.title ? "max-h-screen py-2" : "max-h-0"
                      }`}
                    >
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.href}
                          className={`block py-2 ${
                            pathname === subItem.href ? "text-indigo-600" : "text-gray-600"
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
