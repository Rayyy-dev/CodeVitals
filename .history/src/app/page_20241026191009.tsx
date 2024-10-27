'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiCpu, FiGitBranch, FiGitPullRequest, FiChevronRight, FiBarChart2, FiFileText, FiUsers, FiArrowRight } from 'react-icons/fi';

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="h-full bg-white shadow-lg overflow-hidden group rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
  >
    <div className="p-6 transition-colors duration-300 group-hover:bg-blue-50">
      <Icon className="w-12 h-12 text-blue-500 mb-4 transition-colors duration-300 group-hover:text-blue-600" />
      <h3 className="text-xl font-bold mb-2 text-gray-800 transition-colors duration-300 group-hover:text-blue-700">{title}</h3>
      <p className="text-gray-600 transition-colors duration-300 group-hover:text-blue-800">{description}</p>
    </div>
  </motion.div>
);

const BackgroundDecoration = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50"></div>
    <div className="absolute inset-0 opacity-30">
      <div className="absolute inset-0 bg-grid"></div>
      <div className="absolute inset-0 bg-blur animate-subtle-drift"></div>
    </div>
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
                  className="bg-gradient-to-br from-gray-900 to-gray-800 text-white text-lg px-10 py-4 rounded-full hover:from-gray-800 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto shadow-lg hover:shadow-xl"
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

            <div className="mb-20 bg-white rounded-3xl shadow-xl p-10">
              <h2 className="text-3xl font-bold mb-10 text-center text-gray-900">How Code Vitals Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { icon: FiGithub, title: "Connect", description: "Link your GitHub repositories to Code Vitals." },
                  { icon: FiBarChart2, title: "Analyze", description: "Our AI examines your code for quality and patterns." },
                  { icon: FiFileText, title: "Report", description: "Receive detailed reports and actionable insights." },
                  { icon: FiUsers, title: "Collaborate", description: "Share reports with your team and track improvements." }
                ].map((item, index) => (
                  <motion.div key={index} className="text-center p-6 bg-blue-50 rounded-2xl transition-all duration-300 transform hover:scale-105"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <item.icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="text-center bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 rounded-3xl shadow-xl">
              <h2 className="text-3xl font-bold mb-4">
                Join the coding <span className="text-blue-400">revolution</span>
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Thousands of developers are already optimizing their code with Code Vitals.
              </p>
              <button
                className="group bg-gradient-to-br from-gray-900 to-gray-800 text-white hover:from-gray-800 hover:to-gray-700 text-lg px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto shadow-lg hover:shadow-xl"
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
  );
}
