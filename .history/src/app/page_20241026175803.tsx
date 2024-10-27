'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiCpu, FiTrendingUp, FiActivity } from 'react-icons/fi';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const handleSignIn = () => {
    signIn('github', { callbackUrl: '/dashboard' });
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-500 rounded-lg mr-3 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 12V8H6C5.46957 8 4.96086 7.78929 4.58579 7.41421C4.21071 7.03914 4 6.53043 4 6C4 4.9 4.9 4 6 4H18V8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 6V18C4 19.1 4.9 20 6 20H20V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18 12L22 16L18 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-xl font-semibold">Code Vitals</span>
          </div>
          <button
            onClick={handleSignIn}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium text-sm border border-blue-600 hover:bg-blue-50 transition-colors duration-300 flex items-center"
          >
            <FiGithub className="w-5 h-5 mr-2" />
            Login with GitHub
          </button>
        </header>
        
        <main className="text-center">
          <h1 className="text-5xl font-bold mb-6">
            Elevate Your <span className="text-blue-600">Code Quality</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Harness AI-powered insights to perfect your GitHub repositories in real-time.
          </p>
          <button
            onClick={handleSignIn}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Start Analyzing
          </button>
        </main>
        
        <div className="mt-24 relative">
          <div className="absolute inset-0 bg-blue-50 rounded-3xl" style={{ height: '70%', zIndex: -1 }}></div>
        </div>
      </div>
    </div>
  );
}
