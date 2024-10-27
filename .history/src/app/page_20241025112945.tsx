'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <header className="py-6 px-4">
        <nav className="container mx-auto flex justify-between items-center">
          <span className="text-2xl font-bold">Code Vitals</span>
          <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">About</a>
        </nav>
      </header>

      <main className="flex-grow flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Elevate Your <span className="text-blue-400">GitHub</span> Repositories
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-300">
              Gain deep insights, optimize performance, and boost your project's health with our cutting-edge analytics.
            </p>
            <button
              onClick={handleSignIn}
              className="bg-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            >
              Get Started with GitHub
            </button>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Real-time Analysis', description: 'Continuous monitoring and instant feedback on your code.' },
              { title: 'AI-Powered Insights', description: 'Advanced algorithms provide tailored recommendations.' },
              { title: 'Collaboration Tools', description: 'Enhance team productivity with our integrated features.' },
            ].map((feature, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-blue-400">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-gray-400">
        <p>&copy; 2023 Code Vitals. All rights reserved.</p>
      </footer>
    </div>
  );
}
