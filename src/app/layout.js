"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FloatingCartButton from "./components/FloatingCartButton";
import { usePathname } from "next/navigation";
import { useState, useEffect, Suspense } from "react"; // Added Suspense import
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

        {/* Wrap children in Suspense boundary */}
        <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
          {children}
        </Suspense>
<Toaster position="top-right" />
        {/* ✅ Show Floating Cart only if not admin route */}
        {!isAdminRoute && <FloatingCartButton />}

        {/* ✅ Show Footer only if not admin route */}
        {!isAdminRoute && <Footer />}

         
      </body>
    </html>
  );
}