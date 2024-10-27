import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { NextAuthProvider } from "../components/NextAuthProvider";
import Image from 'next/image';

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
          <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center">
                <svg width="40" height="40" viewBox="0 0 200 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                  <path d="M10 25L30 5L50 25L30 45L10 25Z" fill="#3B82F6" />
                  <path d="M30 5L50 25L70 5L50 25L30 5Z" fill="#60A5FA" />
                  <path d="M50 25L70 5L90 25L70 45L50 25Z" fill="#93C5FD" />
                </svg>
                <a href="/" className="text-xl font-bold">Code Vitals</a>
              </div>
              <div className="flex items-center space-x-4">
                <a href="/dashboard" className="hover:text-blue-300">Dashboard</a>
                <a href="/profile" className="hover:text-blue-300">Profile</a>
                <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">Sign Out</button>
              </div>
            </div>
          </nav>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
