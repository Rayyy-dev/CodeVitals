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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 to-blue-100 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 text-gray-900 leading-tight">
          Elevate Your <span className="text-blue-600 hover:text-blue-700 transition-colors duration-300">Code</span>
        </h1>
        <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Analyze and enhance your GitHub repository health with precision and AI-driven insights.
        </p>
      </div>
      <button
        onClick={handleSignIn}
        className="bg-black text-white px-10 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center"
      >
        <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
        </svg>
        Login with GitHub
      </button>
      <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
        {[
          { title: 'AI Analysis', description: 'Advanced algorithms for comprehensive repo health', icon: '🧠' },
          { title: 'Smart Insights', description: 'Tailored recommendations for code improvement', icon: '💡' },
          { title: 'Live Tracking', description: 'Real-time updates on your repository progress', icon: '📊' },
        ].map((feature, index) => (
          <div key={index} className="bg-gradient-to-br from-white to-gray-50 p-1 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group">
            <div className="bg-white p-6 rounded-2xl h-full flex flex-col">
              <div className="text-4xl mb-4 bg-blue-100 w-16 h-16 flex items-center justify-center rounded-full group-hover:bg-blue-200 transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 flex-grow">{feature.description}</p>
              <div className="mt-4 flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors duration-300">
                Learn more
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}