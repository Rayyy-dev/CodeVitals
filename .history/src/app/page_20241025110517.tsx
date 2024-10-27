'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
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

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Code Vitals</h1>
      <p className="text-xl mb-8">Analyze and improve your GitHub repository health</p>
      {!session ? (
        <button
          onClick={handleSignIn}
          className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
        >
          Login with GitHub
        </button>
      ) : (
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      )}
    </div>
  );
}
