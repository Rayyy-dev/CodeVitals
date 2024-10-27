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
          <nav className="bg-white border-b border-gray-200 px-4 py-2.5">
            <div className="flex flex-wrap justify-between items-center">
              <div className="flex items-center">
                <svg width="40" height="40" viewBox="0 0 200 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                  <path d="M10 25L30 5L50 25L30 45L10 25Z" fill="#3B82F6" />
                  <path d="M30 5L50 25L70 5L50 25L30 5Z" fill="#60A5FA" />
                  <path d="M50 25L70 5L90 25L70 45L50 25Z" fill="#93C5FD" />
                </svg>
                <a href="/" className="text-xl font-bold text-gray-800">Code Vitals</a>
              </div>
              <div className="flex items-center">
                <a href="/logout" className="text-gray-600 hover:text-gray-800 flex items-center">
                  <span className="mr-2">Logout</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </nav>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
