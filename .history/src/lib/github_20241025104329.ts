import axios from 'axios';
import { Repository } from '@/types';

export async function fetchUserRepositories(token: string): Promise<Repository[]> {
  const response = await axios.get('https://api.github.com/user/repos', {
    headers: {
      Authorization: `token ${token}`,
    },
  });
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
  if (!repo.size) return 0;
  return Math.round(Math.max(0, 100 - repo.size / 100));
}

function calculateCodeDuplication(repo: any): number {
  // Placeholder: In a real scenario, you'd use a code analysis tool
  return repo.size ? 80 : 100;
}

function calculateCodeStyleConsistency(repo: any): number {
  return repo.language ? 80 : 0;
}

function calculateTestCoverage(repo: any): number {
  // Check for common test directories or files
  const hasTests = repo.contents?.some((file: any) => 
    /test|spec|__tests__/.test(file.name)
  ) ?? false;
  return hasTests ? 70 : 0;
}

function calculateOpenIssuesAndPRs(repo: any): number {
  const totalIssues = repo.open_issues_count || 0;
  return Math.round(Math.max(0, 100 - totalIssues * 2));
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
    suggestions.push("🚀 Your repository is ready for takeoff! Start by adding some code and a README file to set the foundation for your project.");
    return suggestions;
  }

  if (metrics.codeComplexity < 70) suggestions.push(`🧠 Simplify your codebase in ${repo.name}. Consider breaking down complex functions and using design patterns to improve readability and maintainability.`);
  if (metrics.codeDuplication < 70) suggestions.push(`🔄 DRY up your code in ${repo.name}. Identify and refactor repeated code segments into reusable functions or modules to enhance maintainability.`);
  if (metrics.codeStyleConsistency < 70) suggestions.push(`🎨 Harmonize your code style in ${repo.name}. Implement a linter and formatter to ensure consistent coding practices across your project.`);
  if (metrics.testCoverage < 70) suggestions.push(`🧪 Boost your test game in ${repo.name}. Increase test coverage by adding unit tests for critical functions and integration tests for key workflows.`);
  if (metrics.openIssuesAndPRs < 70) suggestions.push(`🔍 Tidy up ${repo.name}'s backlog. Address open issues and review pull requests to keep your project moving forward and your community engaged.`);
  if (metrics.dependencyManagement < 70) suggestions.push(`📦 Keep ${repo.name} up-to-date. Regularly update dependencies to benefit from the latest features, performance improvements, and security patches.`);
  if (metrics.documentationQuality < 70) suggestions.push(`📚 Enhance ${repo.name}'s documentation. Improve your README, add inline comments, and consider creating a wiki to make your project more accessible to contributors and users.`);
  if (metrics.commitFrequency < 70) suggestions.push(`⏱️ Maintain momentum in ${repo.name}. Aim for more frequent, smaller commits to track progress and make collaboration easier.`);
  if (metrics.branchingStrategy < 70) suggestions.push(`🌿 Optimize ${repo.name}'s branching strategy. Implement a clear branching model (e.g., Git Flow) to streamline your development process and collaboration.`);

  return suggestions;
}
