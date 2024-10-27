import axios from 'axios';
import { Repository } from '@/types';

export async function fetchUserRepositories(token: string): Promise<Repository[]> {
  const response = await axios.get('https://api.github.com/user/repos', {
    headers: {
      Authorization: `token ${token}`,
    },
  });

  return response.data;
}

export function calculateHealthScore(repo: any): number {
  const hasReadme = repo.has_readme ? 20 : 0;
  const hasLicense = repo.license ? 20 : 0;
  const issuesScore = Math.max(0, 20 - repo.open_issues_count);
  const starsScore = Math.min(20, repo.stargazers_count);
  const updatedRecently = new Date(repo.updated_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) ? 20 : 0;

  return hasReadme + hasLicense + issuesScore + starsScore + updatedRecently;
}

export async function fetchRepositories(token: string): Promise<Repository[]> {
  try {
    const repos = await fetchUserRepositories(token);
    return repos.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      health_score: calculateHealthScore(repo),
      // Add more properties as needed, for example:
      // stars: repo.stargazers_count,
      // forks: repo.forks_count,
      // open_issues: repo.open_issues_count,
      // last_updated: repo.updated_at,
    }));
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
}
