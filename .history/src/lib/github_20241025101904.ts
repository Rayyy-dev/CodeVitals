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

function calculateCodeComplexity(repo: any): number {
  // This is a placeholder. In a real-world scenario, you'd use a code analysis tool.
  return repo.size ? Math.min(100, Math.max(0, 100 - repo.size / 1000)) : 100;
}

function calculateCodeDuplication(repo: any): number {
  // Placeholder: In reality, you'd use a code duplication detection tool.
  return 100; // Assuming no duplication by default
}

function calculateCodeStyleConsistency(repo: any): number {
  // Placeholder: You'd typically use a linter or style checker.
  return repo.language ? 80 : 100; // Assuming good consistency if a language is detected
}

function calculateTestCoverage(repo: any): number {
  // Placeholder: You'd use a test coverage tool in practice.
  return repo.has_issues ? 70 : 100; // Assuming some test coverage if issues are enabled
}

function calculateOpenIssuesAndPRs(repo: any): number {
  const totalIssues = repo.open_issues_count || 0;
  const score = totalIssues === 0 ? 100 : Math.max(0, 100 - totalIssues * 2);
  return Math.min(100, score);
}

function calculateDependencyManagement(repo: any): number {
  // Placeholder: You'd typically check the age and versions of dependencies.
  const daysSinceLastUpdate = (new Date().getTime() - new Date(repo.updated_at).getTime()) / (1000 * 3600 * 24);
  return Math.max(0, 100 - daysSinceLastUpdate);
}
