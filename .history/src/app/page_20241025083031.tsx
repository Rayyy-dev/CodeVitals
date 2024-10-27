'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">GitHub Repository Health Checker</h1>
      <button
        onClick={() => signIn('github')}
        className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
      >
        Login with GitHub
      </button>
    </div>
  );
}
