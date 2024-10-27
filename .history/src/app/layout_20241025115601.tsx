import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { NextAuthProvider } from "../components/NextAuthProvider";
import Image from 'next/image';
import LogoutButton from '../components/LogoutButton';

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 flex flex-col min-h-screen`}
      >
        <NextAuthProvider>
          <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <svg width="40" height="40" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
                    <rect width="44" height="44" rx="10" fill="#F0F4F8"/>
                    <path d="M14 22H30" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M19 16L14 22L19 28" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M25 16L30 22L25 28" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-xl font-bold text-gray-800">Code Vitals</span>
                </div>
                <div className="flex items-center">
                  <LogoutButton />
                </div>
              </div>
            </div>
          </nav>
          <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="bg-gray-800 text-white py-8 mt-auto">
            <div className="container mx-auto px-4 text-center">
              <p>© 2024 Code Vitals. All rights reserved.</p>
              <div className="mt-4 flex justify-center space-x-4">
                <a href="#" className="hover:text-blue-400 transition-colors duration-300">Privacy Policy</a>
                <a href="#" className="hover:text-blue-400 transition-colors duration-300">Terms of Service</a>
                <a href="#" className="hover:text-blue-400 transition-colors duration-300">Contact Us</a>
              </div>
            </div>
          </footer>
        </NextAuthProvider>
      </body>
    </html>
  );
}
