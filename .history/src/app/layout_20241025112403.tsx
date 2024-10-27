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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider>
          <nav className="bg-white shadow-sm px-6 py-3">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="44" height="44" rx="10" fill="#F0F4F8"/>
                  <path d="M14 22H30" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M19 16L14 22L19 28" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M25 16L30 22L25 28" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xl font-semibold text-gray-800">Code Vitals</span>
              </div>
              <div className="flex items-center space-x-4">
                <a href="/dashboard" className="text-gray-600 hover:text-gray-800 transition-colors">Dashboard</a>
                <a href="/profile" className="text-gray-600 hover:text-gray-800 transition-colors">Profile</a>
                <LogoutButton />
              </div>
            </div>
          </nav>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
