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
  const metrics = {
    codeComplexity: calculateCodeComplexity(repo),
    codeDuplication: calculateCodeDuplication(repo),
    codeStyleConsistency: calculateCodeStyleConsistency(repo),
    testCoverage: calculateTestCoverage(repo),
    openIssuesAndPRs: calculateOpenIssuesAndPRs(repo),
    dependencyManagement: calculateDependencyManagement(repo),
    documentationQuality: calculateDocumentationQuality(repo),
    commitFrequency: calculateCommitFrequency(repo),
    branchingStrategy: calculateBranchingStrategy(repo)
  };

  const score = Math.round(Object.values(metrics).reduce((sum, value) => sum + value, 0) / Object.keys(metrics).length);

  const suggestions = generateSuggestions(repo, metrics);

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
  return Math.round(repo.size ? Math.min(100, Math.max(0, 100 - repo.size / 1000)) : 100);
}

function calculateCodeDuplication(repo: any): number {
  return 100; // Assuming no duplication by default
}

function calculateCodeStyleConsistency(repo: any): number {
  return repo.language ? 80 : 100; // Assuming good consistency if a language is detected
}

function calculateTestCoverage(repo: any): number {
  return repo.has_issues ? 70 : 100; // Assuming some test coverage if issues are enabled
}

function calculateOpenIssuesAndPRs(repo: any): number {
  const totalIssues = repo.open_issues_count || 0;
  const score = totalIssues === 0 ? 100 : Math.max(0, 100 - totalIssues * 2);
  return Math.round(Math.min(100, score));
}

function calculateDependencyManagement(repo: any): number {
  const daysSinceLastUpdate = (new Date().getTime() - new Date(repo.updated_at).getTime()) / (1000 * 3600 * 24);
  return Math.round(Math.max(0, 100 - daysSinceLastUpdate));
}

function calculateDocumentationQuality(repo: any): number {
  const hasReadme = repo.contents?.some((file: any) => file.name.toLowerCase() === 'readme.md') ?? false;
  const hasWiki = repo.has_wiki ?? false;
  return (hasReadme ? 50 : 0) + (hasWiki ? 50 : 0);
}

function calculateCommitFrequency(repo: any): number {
  // Placeholder: In a real scenario, you'd analyze commit history
  return repo.pushed_at ? 80 : 0;
}

function calculateBranchingStrategy(repo: any): number {
  // Placeholder: In a real scenario, you'd analyze branch structure
  return repo.default_branch === 'main' || repo.default_branch === 'master' ? 80 : 50;
}

function generateSuggestions(repo: any, metrics: any): string[] {
  const suggestions = [];

  if (repo.size === 0) {
    suggestions.push("This repository is empty. Start by adding some code and a README file.");
    return suggestions;
  }

  if (metrics.codeComplexity < 70) suggestions.push(`Consider refactoring complex code sections in ${repo.name}.`);
  if (metrics.codeDuplication < 70) suggestions.push(`Reduce code duplication in ${repo.name} to improve maintainability.`);
  if (metrics.codeStyleConsistency < 70) suggestions.push(`Implement a consistent code style across ${repo.name}.`);
  if (metrics.testCoverage < 70) suggestions.push(`Increase test coverage for ${repo.name} to improve code reliability.`);
  if (metrics.openIssuesAndPRs < 70) suggestions.push(`Address open issues and pull requests in ${repo.name}.`);
  if (metrics.dependencyManagement < 70) suggestions.push(`Update dependencies for ${repo.name} regularly.`);
  if (metrics.documentationQuality < 70) suggestions.push(`Improve documentation for ${repo.name}, consider adding or updating the README and Wiki.`);
  if (metrics.commitFrequency < 70) suggestions.push(`Increase commit frequency for ${repo.name} to maintain active development.`);
  if (metrics.branchingStrategy < 70) suggestions.push(`Review and improve the branching strategy for ${repo.name}.`);

  return suggestions;
}
