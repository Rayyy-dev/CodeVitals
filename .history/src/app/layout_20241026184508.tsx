import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { NextAuthProvider } from "../components/NextAuthProvider";
import AuthButton from '../components/AuthButton';
import Link from 'next/link';
import { FiGithub } from "react-icons/fi";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Code Vitals",
  description: "Check the health and vitals of your GitHub repositories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-gray-50 to-white flex flex-col min-h-screen`}
      >
        <NextAuthProvider>
          <header className="bg-white bg-opacity-80 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all duration-300 ease-in-out">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <Link href="/" className="flex items-center space-x-2 transition-transform duration-300 ease-in-out transform hover:scale-105">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600">
                    <rect width="32" height="32" rx="8" fill="currentColor" fillOpacity="0.1"/>
                    <path d="M10 16H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M14 11L10 16L14 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18 11L22 16L18 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-xl font-semibold text-gray-900">Code Vitals</span>
                </Link>
                <nav className="hidden md:flex space-x-8">
                  <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Features</Link>
                  <Link href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">How it Works</Link>
                </nav>
                <AuthButton />
              </div>
            </div>
          </header>
          
          <main className="flex-grow">
            {children}
          </main>
          
          <footer className="bg-white bg-opacity-80 backdrop-blur-md text-gray-600 py-8 mt-auto border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Code Vitals</h3>
                <p className="text-sm text-gray-500">© 2023 Code Vitals. All rights reserved.</p>
                <div className="mt-4 space-x-4">
                  <Link href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors duration-300">Terms</Link>
                  <Link href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors duration-300">Privacy</Link>
                  <Link href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors duration-300">Contact</Link>
                </div>
              </div>
            </div>
          </footer>
        </NextAuthProvider>
      </body>
    </html>
  );
}
