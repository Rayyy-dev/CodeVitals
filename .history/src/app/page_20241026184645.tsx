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
    className="bg-white shadow-lg overflow-hidden group rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
  >
    <div className="p-8 transition-colors duration-300 group-hover:bg-blue-50">
      <Icon className="w-16 h-16 text-blue-500 mb-6 transition-colors duration-300 group-hover:text-blue-600" />
      <h3 className="text-2xl font-bold mb-3 text-gray-800 transition-colors duration-300 group-hover:text-blue-700">{title}</h3>
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
          className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 text-gray-900 overflow-hidden">
      <WaveBackground />
      
      <main className="relative z-10">
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <motion.h1 
                className="text-6xl md:text-7xl font-extrabold mb-8 text-gray-900 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Elevate Your <span className="text-blue-600 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">Code Quality</span>
              </motion.h1>
              <motion.p 
                className="text-2xl md:text-3xl text-gray-600 mb-12 max-w-3xl mx-auto"
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
                  className="bg-blue-600 text-white text-xl px-10 py-4 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto shadow-lg hover:shadow-xl"
                  onClick={handleSignIn}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  Start Analyzing 
                  <FiChevronRight className={`ml-2 w-6 h-6 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                </button>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-24">
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

            <div className="mb-24">
              <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">How Code Vitals Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {[
                  { icon: FiGithub, title: "Connect", description: "Link your GitHub repositories to Code Vitals." },
                  { icon: FiBarChart2, title: "Analyze", description: "Our AI examines your code for quality and patterns." },
                  { icon: FiFileText, title: "Report", description: "Receive detailed reports and actionable insights." },
                  { icon: FiUsers, title: "Collaborate", description: "Share reports with your team and track improvements." }
                ].map((item, index) => (
                  <motion.div key={index} className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <item.icon className="w-16 h-16 mx-auto mb-6 text-blue-600" />
                    <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-4xl font-bold mb-6 text-gray-900">
                Join the coding <span className="text-blue-600 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">revolution</span>
              </h2>
              <p className="text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
                Thousands of developers are already optimizing their code with Code Vitals.
              </p>
              <button
                className="group bg-gray-900 text-white hover:bg-gray-800 text-xl px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto shadow-lg hover:shadow-xl"
                onClick={handleSignIn}
              >
                Get Started for Free
                <FiArrowRight className="ml-2 w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
