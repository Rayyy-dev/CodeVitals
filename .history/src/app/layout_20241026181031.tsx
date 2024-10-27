import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { NextAuthProvider } from "../components/NextAuthProvider";
import AuthButton from '../components/AuthButton';
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white flex flex-col min-h-screen`}
      >
        <NextAuthProvider>
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
                    <rect width="32" height="32" rx="8" fill="#E5E7EB"/>
                    <path d="M10 16H22" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M14 11L10 16L14 21" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18 11L22 16L18 21" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-xl font-semibold text-gray-900">Code Vitals</span>
                </div>
                <div>
                  <AuthButton />
                </div>
              </div>
            </div>
          </header>
          <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="bg-neutral-800 text-neutral-300 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Code Vitals</h3>
                  <p className="text-sm">Elevate your code with AI-driven insights and analysis.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-sm hover:text-teal-400 transition-colors duration-300">Home</a></li>
                    <li><a href="#" className="text-sm hover:text-teal-400 transition-colors duration-300">Features</a></li>
                    <li><a href="#" className="text-sm hover:text-teal-400 transition-colors duration-300">Pricing</a></li>
                    <li><a href="#" className="text-sm hover:text-teal-400 transition-colors duration-300">Contact</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Connect</h3>
                  <a href="#" className="flex items-center text-sm hover:text-teal-400 transition-colors duration-300">
                    <FiGithub className="mr-2" />
                    GitHub
                  </a>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-neutral-700 text-sm text-center">
                <p>© 2024 Code Vitals. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </NextAuthProvider>
      </body>
    </html>
  );
}
