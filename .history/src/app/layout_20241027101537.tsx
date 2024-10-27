import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { NextAuthProvider } from "../components/NextAuthProvider";
import { Github } from 'lucide-react';
import { Button } from "@/components/ui/button";

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
                <Button
                  variant="outline"
                  className="text-indigo-600 border-indigo-600 hover:bg-indigo-50"
                  onClick={() => console.log("Initiating GitHub OAuth login")}
                >
                  <Github className="w-5 h-5 mr-2" />
                  Login with GitHub
                </Button>
              </div>
            </nav>
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
