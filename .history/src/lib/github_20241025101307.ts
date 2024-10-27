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

export function calculateQualityScore(repo: any): { score: number; metrics: any; suggestions: string[] } {
  const codeComplexity = Math.floor(Math.random() * 100);
  const codeDuplication = Math.floor(Math.random() * 100);
  const codeStyleConsistency = Math.floor(Math.random() * 100);
  const testCoverage = Math.floor(Math.random() * 100);
  const openIssuesAndPRs = Math.floor(Math.random() * 100);
  const dependencyManagement = Math.floor(Math.random() * 100);

  const metrics = {
    codeComplexity,
    codeDuplication,
    codeStyleConsistency,
    testCoverage,
    openIssuesAndPRs,
    dependencyManagement
  };

  const score = Math.floor((codeComplexity + codeDuplication + codeStyleConsistency + testCoverage + openIssuesAndPRs + dependencyManagement) / 6);

  const suggestions = [];
  if (codeComplexity < 70) suggestions.push("Reduce code complexity");
  if (codeDuplication < 70) suggestions.push("Reduce code duplication");
  if (codeStyleConsistency < 70) suggestions.push("Improve code style consistency");
  if (testCoverage < 70) suggestions.push("Increase test coverage");
  if (openIssuesAndPRs < 70) suggestions.push("Address open issues and pull requests");
  if (dependencyManagement < 70) suggestions.push("Improve dependency management");

  return { score, metrics, suggestions };
}

export async function fetchRepositories(token: string): Promise<Repository[]> {
  try {
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${token}` },
    });
    const avatarUrl = userResponse.data.avatar_url;

    const repos = await fetchUserRepositories(token);
    return repos.map((repo: any) => {
      const { score, metrics, suggestions } = calculateQualityScore(repo);
      return {
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        quality_score: score,
        metrics: metrics,
        suggestions: suggestions,
        avatar_url: avatarUrl,
      };
    });
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
}
