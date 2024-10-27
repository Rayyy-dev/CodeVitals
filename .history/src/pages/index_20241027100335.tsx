import { useState } from 'react';
import { FiGithub } from 'react-icons/fi';
import { motion } from 'framer-motion';
import PublicRepoScanner from '@/components/PublicRepoScanner';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center mr-2">
            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-b-[14px] border-b-white border-r-[8px] border-r-transparent"></div>
          </div>
          <span className="text-xl font-bold text-blue-600">Code Vitals</span>
        </div>
        <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors duration-200">
          <FiGithub className="inline-block mr-2" />
          Login with GitHub
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-5xl sm:text-6xl font-bold text-center text-blue-600 mb-4">
          Elevate Your Code Quality
        </h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          Harness AI-powered insights to perfect your GitHub repositories in real-time.
        </p>
        <PublicRepoScanner />
      </main>
    </div>
  );
}
