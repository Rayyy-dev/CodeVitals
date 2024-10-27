import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { NextAuthProvider } from "../components/NextAuthProvider";
import AuthButton from '../components/AuthButton';

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
          <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 16H22" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                      <path d="M14 11L10 16L14 21" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18 11L22 16L18 21" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-lg font-semibold text-gray-900 tracking-tight">Code Vitals</span>
                </div>
                <AuthButton />
              </div>
            </div>
          </header>
          
          <main className="flex-grow">
            {children}
          </main>
          
          <footer className="bg-white text-gray-600 py-8 mt-auto border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Code Vitals</h3>
                <p className="text-sm">© 2023 Code Vitals. All rights reserved.</p>
                <div className="mt-4 space-x-4">
                  <a href="#" className="text-sm hover:text-blue-600 transition-colors duration-300">Terms</a>
                  <a href="#" className="text-sm hover:text-blue-600 transition-colors duration-300">Privacy</a>
                  <a href="#" className="text-sm hover:text-blue-600 transition-colors duration-300">Contact</a>
                </div>
              </div>
            </div>
          </footer>
        </NextAuthProvider>
      </body>
    </html>
  );
}
