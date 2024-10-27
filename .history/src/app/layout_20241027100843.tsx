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
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <NextAuthProvider>
          <header className="bg-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-20">
                <div className="flex items-center space-x-3">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L20 8V16L12 20L4 16V8L12 4Z" fill="#3B82F6" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 4V20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 8L20 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20 8L4 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-2xl font-semibold text-gray-900">Code Vitals</span>
                </div>
                <button className="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-full text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <svg className="mr-2 -ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                  Login with GitHub
                </button>
              </div>
            </div>
          </header>
          
          <main className="flex-grow bg-white">
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
