import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiHome } from 'react-icons/fi';
import RepositoryMetrics from '@/components/RepositoryMetrics';

export default function PublicDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [repoData, setRepoData] = useState(null);

  useEffect(() => {
    const repoUrl = searchParams.get('repo');
    if (!repoUrl) {
      router.push('/');
      return;
    }

    // Fetch repository data
    fetch(`/api/scan-public-repo?url=${encodeURIComponent(repoUrl)}`)
      .then(response => response.json())
      .then(data => setRepoData(data))
      .catch(error => console.error('Error fetching repository data:', error));
  }, [router, searchParams]);

  if (!repoData) {
    return <div>Loading...</div>;
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
