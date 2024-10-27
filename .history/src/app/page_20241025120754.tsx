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
      <div className="flex justify-center items-center min-h-screen bg-neutral-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-500">
            Elevate Your Code
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Analyze and enhance your GitHub repositories with AI-driven insights.
          </p>
        </motion.div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSignIn}
          className="mx-auto block bg-neutral-800 text-neutral-50 px-6 py-3 rounded-lg font-medium text-base shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center"
        >
          <FiGithub className="w-5 h-5 mr-2" />
          Login with GitHub
        </motion.button>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'AI Analysis', description: 'Advanced algorithms for comprehensive repo health', icon: FiCpu },
            { title: 'Smart Insights', description: 'Tailored recommendations for code improvement', icon: FiTrendingUp },
            { title: 'Live Tracking', description: 'Real-time updates on your repository progress', icon: FiActivity },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <feature.icon className="text-3xl mb-4 text-teal-500" />
              <h3 className="text-xl font-semibold mb-2 text-neutral-800">{feature.title}</h3>
              <p className="text-neutral-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
