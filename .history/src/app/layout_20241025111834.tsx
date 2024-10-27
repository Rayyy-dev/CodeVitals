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
          <nav className="bg-white border-b border-gray-200 px-4 py-2.5">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
                  <rect width="40" height="40" rx="8" fill="#F3F4F6"/>
                  <path d="M13 20H27" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M18 15L13 20L18 25" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 15L27 20L22 25" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xl font-bold text-gray-800">Code Vitals</span>
              </div>
              <div className="flex items-center">
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
