'use client';

import { useState, useEffect } from 'react';
import { Repository } from '@/types';
import { fetchRepositories } from '@/lib/github';
import RepositoryCard from '@/components/RepositoryCard';

export default function Dashboard() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRepositories = async () => {
      try {
        const repos = await fetchRepositories();
        setRepositories(repos);
      } catch (error) {
        console.error('Error fetching repositories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRepositories();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Repositories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repositories.map((repo) => (
          <RepositoryCard key={repo.id} repository={repo} />
        ))}
      </div>
    </div>
  );
}
