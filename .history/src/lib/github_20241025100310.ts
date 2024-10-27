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

export function calculateQualityScore(repo: any): { score: number; issues: any; suggestions: string[] } {
  const codeStyle = Math.random() * 100; // Placeholder: replace with actual code style analysis
  const documentation = Math.random() * 100; // Placeholder: replace with actual documentation analysis
  const testCoverage = Math.random() * 100; // Placeholder: replace with actual test coverage analysis
  const performance = Math.random() * 100; // Placeholder: replace with actual performance analysis

  const issues = {
    code_style: codeStyle,
    documentation: documentation,
    test_coverage: testCoverage,
    performance: performance
  };

  const score = (codeStyle + documentation + testCoverage + performance) / 4;

  const suggestions = [];
  if (codeStyle < 70) suggestions.push("Improve code style and formatting");
  if (documentation < 70) suggestions.push("Enhance documentation coverage");
  if (testCoverage < 70) suggestions.push("Increase test coverage");
  if (performance < 70) suggestions.push("Optimize code for better performance");

  return { score, issues, suggestions };
}

export async function fetchRepositories(token: string): Promise<Repository[]> {
  try {
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${token}` },
    });
    const avatarUrl = userResponse.data.avatar_url;

    const repos = await fetchUserRepositories(token);
    return repos.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      health_score: calculateHealthScore(repo),
      avatar_url: avatarUrl,
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
