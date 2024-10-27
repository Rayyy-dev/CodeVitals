'use client';

import { useSession } from 'next-auth/react';
import { fetchRepositories } from '@/lib/github';
import RepositoryCard from '@/components/RepositoryCard';
import { Repository } from '@/types';
import { useRouter } from 'next/navigation';
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { fetchRepositories } from '@/lib/github';
import RepositoryCard from '@/components/RepositoryCard';
import RepositoryMetrics from '@/components/RepositoryMetrics';
import { Repository } from '@/types';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Repositories</h1>
      <div className="flex">
        <div className="w-1/2 pr-4">
          <div className="grid grid-cols-1 gap-4">
            {repositories.map((repo) => (
              <RepositoryCard
                key={repo.id}
                repository={repo}
                onClick={() => setSelectedRepo(repo)}
                isSelected={selectedRepo?.id === repo.id}
              />
            ))}
          </div>
        </div>
        <div className="w-1/2 pl-4">
          {selectedRepo ? (
            <RepositoryMetrics repository={selectedRepo} />
          ) : (
            <div className="bg-gray-100 rounded-lg p-6 text-center">
              Select a repository to view its metrics
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
                repository={repo}
                onClick={() => setSelectedRepo(repo)}
                isSelected={selectedRepo?.id === repo.id}
              />
            ))}
          </div>
        </div>
        <div className="w-1/2 pl-4">
          {selectedRepo ? (
            <RepositoryMetrics repository={selectedRepo} />
          ) : (
            <div className="bg-gray-100 rounded-lg p-6 text-center">
              Select a repository to view its metrics
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
