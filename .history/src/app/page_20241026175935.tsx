'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiGithub } from 'react-icons/fi';

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
    <div className="min-h-screen bg-white text-neutral-800 flex flex-col">
      <header className="py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-lg mr-2"></div>
          <span className="text-xl font-bold">Code Vitals</span>
        </div>
        <button
          onClick={handleSignIn}
          className="flex items-center px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-300"
        >
          <FiGithub className="w-5 h-5 mr-2" />
          Login with GitHub
        </button>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl"
        >
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            Elevate Your <span className="text-blue-600">Code Quality</span>
          </h1>
          <p className="text-xl text-neutral-600 mb-8">
            Harness AI-powered insights to perfect your GitHub repositories in real-time.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSignIn}
            className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium text-lg shadow-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Start Analyzing
          </motion.button>
        </motion.div>
      </main>
      <div className="h-32 bg-blue-50 w-full absolute bottom-0 left-0" style={{
        clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)'
      }}></div>
    </div>
  );
}
