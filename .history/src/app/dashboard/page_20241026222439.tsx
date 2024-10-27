'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { fetchRepositories } from '@/lib/github';
import RepositorySelector from '@/components/RepositorySelector';
import { Repository } from '@/types';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Image from 'next/image';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }

    const loadRepositories = async () => {
      if (session?.accessToken) {
        try {
          const repos = await fetchRepositories(session.accessToken as string);
          setRepositories(repos);
        } catch (error) {
          console.error('Error fetching repositories:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (status === 'authenticated') {
      loadRepositories();
    }
  }, [session, status, router]);

  if (status === 'loading' || loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const publicRepos = repositories.filter(repo => !repo.private).length;
  const privateRepos = repositories.filter(repo => repo.private).length;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <div className="flex items-center">
            {session?.user?.image && (
              <Image
                src={session.user.image}
                alt="User avatar"
                width={64}
                height={64}
                className="rounded-full mr-4"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold mb-2">Welcome, {session?.user?.name}</h2>
              <p className="text-gray-600">
                Public Repositories: {publicRepos} | Private Repositories: {privateRepos}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Repository Health</h2>
          <RepositorySelector repositories={repositories} />
        </div>
      </main>
    </div>
  );
}
