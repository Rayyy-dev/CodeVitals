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
  const codeComplexity = calculateCodeComplexity(repo);
  const codeDuplication = calculateCodeDuplication(repo);
  const codeStyleConsistency = calculateCodeStyleConsistency(repo);
  const testCoverage = calculateTestCoverage(repo);
  const openIssuesAndPRs = calculateOpenIssuesAndPRs(repo);
  const dependencyManagement = calculateDependencyManagement(repo);

  const metrics = {
    codeComplexity,
    codeDuplication,
    codeStyleConsistency,
    testCoverage,
    openIssuesAndPRs,
    dependencyManagement
  };

  const score = Math.floor(Object.values(metrics).reduce((sum, value) => sum + value, 0) / Object.keys(metrics).length);

  const suggestions = [];
  if (codeComplexity < 70) suggestions.push("Consider refactoring complex code sections");
  if (codeDuplication < 70) suggestions.push("Reduce code duplication to improve maintainability");
  if (codeStyleConsistency < 70) suggestions.push("Implement a consistent code style across the project");
  if (testCoverage < 70) suggestions.push("Increase test coverage to improve code reliability");
  if (openIssuesAndPRs < 70) suggestions.push("Address open issues and pull requests");
  if (dependencyManagement < 70) suggestions.push("Update and manage dependencies regularly");

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
