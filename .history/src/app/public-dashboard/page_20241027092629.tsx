'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiHome } from 'react-icons/fi';
import RepositoryMetrics from '@/components/RepositoryMetrics';

interface RepoData {
  // Define the structure of your repository data here
  name: string;
  url: string;
  // ... other properties
}

export default function PublicDashboard() {
  const searchParams = useSearchParams();
  const [repoData, setRepoData] = useState<RepoData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const repoUrl = searchParams.get('repo');
    if (!repoUrl) {
      setError('No repository URL provided');
      return;
    }

    fetch(`/api/scan-public-repo?url=${encodeURIComponent(repoUrl)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setRepoData(data))
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
        <RepositoryMetrics repository={{
          id: repoData.id || '',
          full_name: repoData.name || '',
          private: false,
          quality_score: repoData.quality_score || 0,
          url: repoData.url || '',
          // Add other required properties with default values
          // This is a temporary fix and should be properly typed
          ...repoData
        }} />
      </main>
    </div>
  );
}
