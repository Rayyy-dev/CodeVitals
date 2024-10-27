'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { fetchRepositories } from '@/lib/github';
import RepositorySelector from '@/components/RepositorySelector';
import UserProfile from '@/components/UserProfile';
import { Repository } from '@/types';
import { useRouter } from 'next/navigation';

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  private: boolean;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;
}

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
          // Convert GitHubRepository to Repository
          const convertedRepos: Repository[] = (repos as GitHubRepository[]).map(repo => ({
            id: repo.id,
            name: repo.name,
            fullName: repo.full_name,
            url: repo.html_url,
            description: repo.description || '',
            isPrivate: repo.private,
            isFork: repo.fork,
            createdAt: repo.created_at,
            updatedAt: repo.updated_at,
            pushedAt: repo.pushed_at,
            size: repo.size,
            stargazersCount: repo.stargazers_count,
            watchersCount: repo.watchers_count,
            language: repo.language || '',
            forksCount: repo.forks_count,
            openIssuesCount: repo.open_issues_count,
            defaultBranch: repo.default_branch,
          }));
          setRepositories(convertedRepos);
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
      <UserProfile session={session} repositories={repositories} />
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Repository Health</h2>
        <RepositorySelector repositories={repositories} />
      </div>
    </div>
  );
}
