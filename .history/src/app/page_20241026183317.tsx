'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiCpu, FiGitBranch, FiGitPullRequest, FiChevronRight, FiBarChart2, FiFileText, FiUsers, FiArrowRight } from 'react-icons/fi';
import AuthButton from '../components/AuthButton';

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="h-full bg-white shadow-lg overflow-hidden group rounded-xl"
  >
    <div className="p-6 transition-colors duration-300 group-hover:bg-blue-50">
      <Icon className="w-12 h-12 text-blue-500 mb-4 transition-colors duration-300 group-hover:text-blue-600" />
      <h3 className="text-xl font-bold mb-2 text-gray-800 transition-colors duration-300 group-hover:text-blue-700">{title}</h3>
      <p className="text-gray-600 transition-colors duration-300 group-hover:text-blue-800">{description}</p>
    </div>
  </motion.div>
);

const WaveBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden">
    <svg className="absolute bottom-0 left-0 w-full h-auto" viewBox="0 0 1440 320" preserveAspectRatio="none">
      <path fill="#E6F3FF" fillOpacity="1" d="M0,32L48,53.3C96,75,192,117,288,122.7C384,128,480,96,576,90.7C672,85,768,107,864,128C960,149,1056,171,1152,165.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
    </svg>
  </div>
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
    <>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
                <rect width="32" height="32" rx="8" fill="#E5E7EB"/>
                <path d="M10 16H22" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
                <path d="M14 11L10 16L14 21" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18 11L22 16L18 21" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xl font-semibold text-gray-900">Code Vitals</span>
            </div>
            <div>
              <AuthButton />
            </div>
          </div>
        </div>
      </header>

      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 text-gray-900 overflow-hidden">
        <WaveBackground />
        
        <main className="relative z-10">
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <motion.h1 
                  className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Elevate Your <span className="text-blue-600">Code Quality</span>
                </motion.h1>
                <motion.p 
                  className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
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
                    className="bg-blue-600 text-white text-lg px-8 py-3 rounded-full hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center mx-auto"
                    onClick={handleSignIn}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    Start Analyzing 
                    <FiChevronRight className={`ml-2 w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                  </button>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                <FeatureCard 
                  icon={FiCpu}
                  title="AI-Powered Analysis"
                  description="Get deep insights into your code quality and complexity with our advanced AI algorithms."
                />
                <FeatureCard 
                  icon={FiGitBranch}
                  title="Smart Branch Comparisons"
                  description="Instantly compare branches to track improvements and catch regressions."
                />
                <FeatureCard 
                  icon={FiGitPullRequest}
                  title="Automated PR Checks"
                  description="Ensure code quality with automated checks on every pull request."
                />
              </div>

              <div className="mb-20">
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">How Code Vitals Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="text-center">
                    <FiGithub className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                    <h3 className="text-xl font-semibold mb-2">Connect</h3>
                    <p className="text-gray-600">Link your GitHub repositories to Code Vitals.</p>
                  </div>
                  <div className="text-center">
                    <FiBarChart2 className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                    <h3 className="text-xl font-semibold mb-2">Analyze</h3>
                    <p className="text-gray-600">Our AI examines your code for quality and patterns.</p>
                  </div>
                  <div className="text-center">
                    <FiFileText className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                    <h3 className="text-xl font-semibold mb-2">Report</h3>
                    <p className="text-gray-600">Receive detailed reports and actionable insights.</p>
                  </div>
                  <div className="text-center">
                    <FiUsers className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                    <h3 className="text-xl font-semibold mb-2">Collaborate</h3>
                    <p className="text-gray-600">Share reports with your team and track improvements.</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">
                  Join the coding <span className="text-blue-600">revolution</span>
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Thousands of developers are already optimizing their code with Code Vitals.
                </p>
                <button
                  className="group bg-gray-900 text-white hover:bg-gray-800 text-lg px-8 py-3 rounded-full transition-colors duration-300 flex items-center justify-center mx-auto"
                  onClick={handleSignIn}
                >
                  Get Started for Free
                  <FiArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

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
    </>
  );
}
