"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FloatingCartButton from "./components/FloatingCartButton";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Hide header, footer, and floating cart button on /admin routes
  const isAdminRoute = mounted && pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* ✅ Show Header only if not admin route */}
        {!isAdminRoute && <Header />}

        {children}

        {/* ✅ Show Floating Cart only if not admin route */}
        {!isAdminRoute && <FloatingCartButton />}

        {/* ✅ Show Footer only if not admin route */}
        {!isAdminRoute && <Footer />}

        {/* 🌟 Global Toaster (always active) */}
        <Toaster
          position="top-center"
          toastOptions={{
            className: "bg-amber-50 text-amber-800 border border-amber-200",
            style: {
              borderRadius: "8px",
              border: "1px solid #fcd34d",
              background: "#fffbeb",
              color: "#92400e",
            },
          }}
        />
      </body>
    </html>
  );
}
