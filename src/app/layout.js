"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

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
    setMounted(true); // wait until client mounts
  }, []);

  // Example: hide header if route starts with /admin
  const hideHeader = mounted && pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {mounted && !hideHeader && <Header />}
        {children}
      </body>
    </html>
  );
}
