'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiCpu, FiGitBranch, FiGitPullRequest, FiChevronRight, FiBarChart2, FiFileText, FiUsers, FiArrowRight } from 'react-icons/fi';
import PublicRepoScanner from '../components/PublicRepoScanner';

const FeatureItem = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="flex items-start space-x-4 p-6 bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl hover:bg-opacity-70 transition-all duration-300"
  >
    <div className="flex-shrink-0">
      <Icon className="w-8 h-8 text-blue-600" />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </motion.div>
);

const BackgroundDecoration = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
      <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-5">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
          </pattern>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2"/>
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0"/>
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <g>
          <motion.path
            d="M0,500 Q250,400 500,500 T1000,500"
            fill="none"
            stroke="url(#grad)"
            strokeWidth="3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M0,600 Q250,500 500,600 T1000,600"
            fill="none"
            stroke="url(#grad)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
          />
          <motion.path
            d="M0,400 Q250,300 500,400 T1000,400"
            fill="none"
            stroke="url(#grad)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 2 }}
          />
        </g>
      </svg>
    </div>
  </div>
);

const WorkflowStep = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) => (
  <motion.div 
    className="flex flex-col items-center text-center p-6 bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl hover:bg-opacity-70 transition-all duration-300"
    whileHover={{ scale: 1.05 }}
  >
    <Icon className="w-12 h-12 text-blue-600 mb-4" />
    <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </motion.div>
);

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

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
          className="w-8 h-8 border-2 border-blue-300 border-t-blue-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 text-gray-900 overflow-hidden">
      <BackgroundDecoration />
      <main className="relative z-10">
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <motion.h1 
                className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Elevate Your <span className="text-blue-600 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">Code Quality</span>
              </motion.h1>
              <motion.p 
                className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Harness AI-powered insights to perfect your GitHub repositories in real-time.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <button
                  className="bg-blue-600 text-white text-lg px-10 py-4 rounded-full hover:bg-blue-700 transition-all duration-300 flex items-center justify-center mx-auto"
                  onClick={handleSignIn}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  Start Analyzing 
                  <FiChevronRight className={`ml-2 w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                </button>
              </motion.div>
            </div>

            <div className="mb-20">
              <PublicRepoScanner />
            </div>

            <div className="mb-20">
              <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FeatureItem 
                  icon={FiCpu}
                  title="AI-Powered Analysis"
                  description="Get deep insights into your code quality and complexity with our advanced AI algorithms."
                />
                <FeatureItem 
                  icon={FiGitBranch}
                  title="Smart Branch Comparisons"
                  description="Instantly compare branches to track improvements and catch regressions."
                />
                <FeatureItem 
                  icon={FiGitPullRequest}
                  title="Automated PR Checks"
                  description="Ensure code quality with automated checks on every pull request."
                />
                <FeatureItem 
                  icon={FiBarChart2}
                  title="Comprehensive Reports"
                  description="Receive detailed analytics and actionable insights to improve your codebase."
                />
              </div>
            </div>

            <div className="mb-20">
              <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">How Code Vitals Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <WorkflowStep 
                  icon={FiGithub}
                  title="Connect"
                  description="Link your GitHub repositories to Code Vitals."
                />
                <WorkflowStep 
                  icon={FiBarChart2}
                  title="Analyze"
                  description="Our AI examines your code for quality and patterns."
                />
                <WorkflowStep 
                  icon={FiFileText}
                  title="Report"
                  description="Receive detailed reports and actionable insights."
                />
                <WorkflowStep 
                  icon={FiUsers}
                  title="Collaborate"
                  description="Share reports with your team and track improvements."
                />
              </div>
            </div>

            <div className="text-center bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 rounded-3xl shadow-xl">
              <h2 className="text-3xl font-bold mb-4">
                Join the coding <span className="text-blue-200">revolution</span>
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Thousands of developers are already optimizing their code with Code Vitals.
              </p>
              <button
                className="group bg-white text-blue-600 hover:bg-blue-50 text-lg px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto shadow-lg hover:shadow-xl"
                onClick={handleSignIn}
              >
                Start 
                <FiArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}