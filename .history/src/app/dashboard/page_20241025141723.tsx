'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { fetchRepositories } from '@/lib/github';
import RepositorySelector from '@/components/RepositorySelector';
import UserProfile from '@/components/UserProfile';
import { Repository } from '@/types';
import { useRouter } from 'next/navigation';

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
          console.log('Fetching repositories...');
          const repos = await fetchRepositories(session.accessToken as string);
          console.log('Fetched repositories:', repos.length);
          console.log('Public repositories:', repos.filter(repo => !repo.private).length);
          console.log('Private repositories:', repos.filter(repo => repo.private).length);
          console.log('First repository:', repos[0]);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <UserProfile session={session} repoCount={repositories.length} />
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Repository Health</h2>
        <RepositorySelector repositories={repositories} />
      </div>
    </div>
  );
}