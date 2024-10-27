'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiHome } from 'react-icons/fi';
import RepositoryMetrics from '@/components/RepositoryMetrics';
import { Repository } from '@/types';

export default function PublicDashboard() {
  const searchParams = useSearchParams();
  const [repoData, setRepoData] = useState<Repository | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const repoUrl = searchParams.get('repo');
    if (!repoUrl) {
      setError('No repository URL provided');
      return;
    }

    fetch('/api/scan-public-repo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: repoUrl }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
        setRepoData(data);
      })
      .catch(error => {
        console.error('Error fetching repository data:', error);
        setError('Failed to fetch repository data. Please try again.');
      });
  }, [searchParams]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!repoData) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Public Repository Analysis</h1>
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800">
            <FiHome className="mr-2" />
            Back to Home
          </Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RepositoryMetrics repository={repoData} />
      </main>
    </div>
  );
}
