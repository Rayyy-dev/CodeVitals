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

const CodeVitalsLogo = () => (
  <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 5L35 30H5L20 5Z" fill="url(#logo-gradient)" />
    <defs>
      <linearGradient id="logo-gradient" x1="5" y1="30" x2="35" y2="5" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3B82F6" />
        <stop offset="1" stopColor="#8B5CF6" />
      </linearGradient>
    </defs>
  </svg>
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <NextAuthProvider>
          <header className="relative z-10">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CodeVitalsLogo />
                  <span className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                    Code Vitals
                  </span>
                </div>
                <AuthButton />
              </div>
            </nav>
          </header>
          
          <main className="flex-grow">
            {children}
          </main>
          
          <footer className="relative z-10 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                    Code Vitals
                  </span>
                  <p className="text-sm text-gray-600">© 2023 Code Vitals. All rights reserved.</p>
                </div>
                <div className="flex space-x-6">
                  <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Terms</a>
                  <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Privacy</a>
                  <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Contact</a>
                </div>
              </div>
            </div>
          </footer>
        </NextAuthProvider>
      </body>
    </html>
  );
}
