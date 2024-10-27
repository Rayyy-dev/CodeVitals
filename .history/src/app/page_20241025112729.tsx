'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';

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
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="py-6 px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <Image src="/logo.svg" alt="Code Vitals Logo" width={40} height={40} />
            <span className="text-2xl font-bold text-gray-800">Code Vitals</span>
          </div>
          <a href="https://github.com/yourusername/code-vitals" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
            GitHub
          </a>
        </nav>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 text-gray-900 leading-tight">
              Elevate Your <span className="text-blue-600">GitHub</span> Repository Health
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Gain actionable insights, improve code quality, and boost your project's vitality with our advanced analytics.
            </p>
          </div>
          
          <div className="flex justify-center mb-16">
            <button
              onClick={handleSignIn}
              className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center"
            >
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
              </svg>
              Login with GitHub
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { title: 'Comprehensive Analysis', description: 'Get a 360° view of your repository health' },
              { title: 'Actionable Insights', description: 'Receive tailored recommendations for improvement' },
              { title: 'Progress Tracking', description: 'Monitor your repository's health over time' },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-gray-500">
        <p>&copy; 2023 Code Vitals. All rights reserved.</p>
      </footer>
    </div>
  );
}
