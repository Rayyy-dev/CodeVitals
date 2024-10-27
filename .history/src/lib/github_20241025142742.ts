import axios from 'axios';
import { Repository } from '@/types';

export async function fetchUserRepositories(token: string): Promise<Repository[]> {
  try {
    const response = await axios.get<Repository[]>('https://api.github.com/user/repos', {
      headers: {
        Authorization: `token ${token}`,
      },
      params: {
        visibility: 'all',
        affiliation: 'owner,collaborator,organization_member',
        sort: 'updated',
        direction: 'desc',
        per_page: 100
      }
    });

    const allRepos = response.data;

    console.log('Fetched repositories:', allRepos.length);
    console.log('Public repositories:', allRepos.filter(repo => !repo.private).length);
    console.log('Private repositories:', allRepos.filter(repo => repo.private).length);
    console.log('First repository:', allRepos[0]);

    return allRepos;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
}

async function fetchRepos(token: string, visibility: 'public' | 'private'): Promise<any[]> {
  const repos = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await axios.get('https://api.github.com/user/repos', {
      headers: {
        Authorization: `token ${token}`,
      },
      params: {
        visibility: visibility,
        affiliation: 'owner,collaborator,organization_member',
        sort: 'updated',
        direction: 'desc',
        per_page: 100,
        page: page
      }
    });

    repos.push(...response.data);

    hasNextPage = response.headers.link && response.headers.link.includes('rel="next"');
    page++;
  }

  return repos;
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
    return Promise.all(repos.map(async (repo: any) => {
      const { score, metrics, suggestions } = calculateQualityScore(repo);
      return {
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        private: repo.private,
        quality_score: score,
        metrics: metrics,
        suggestions: suggestions,
        avatar_url: avatarUrl,
        topIssue: await getTopIssue(repo, token),
        oldestPR: await getOldestPR(repo, token),
        complexFunction: getMostComplexFunction(repo),
        duplicateArea: getMostDuplicatedArea(repo),
      };
    }));
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

  // Check if the repository is small (less than 5 files) or mainly documentation
  const isSmallOrDocRepo = (repo.contents?.length ?? 0) < 5 || 
    repo.contents?.every((file: any) => file.name.toLowerCase().endsWith('.md'));

  // If it's a small or documentation repo, return 100 (not applicable)
  if (isSmallOrDocRepo) {
    return 100;
  }

  // For other repos, return 70 if tests are present, 0 otherwise
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
    suggestions.push("🚀 Your repository is empty. Start by adding a README.md file to describe your project and its purpose.");
    return suggestions;
  }

  if (metrics.codeComplexity < 70) {
    const complexFiles = getComplexFiles(repo);
    suggestions.push(`🧠 Simplify your codebase in ${repo.name}. Focus on these files:\n${complexFiles.map(file => `   - ${file.name}: Consider breaking down the ${file.complexFunction} function.`).join('\n')}`);
  }

  if (metrics.codeDuplication < 70) {
    const duplicateAreas = getDuplicateAreas(repo);
    suggestions.push(`🔄 Reduce code duplication in ${repo.name}. Address these areas:\n${duplicateAreas.map(area => `   - ${area.file}: Lines ${area.startLine}-${area.endLine} are similar to ${area.similarFile}`).join('\n')}`);
  }

  if (metrics.testCoverage < 70) {
    const untested = getUntestedFiles(repo);
    suggestions.push(`🧪 Improve test coverage in ${repo.name}. Add tests for these files:\n${untested.map(file => `   - ${file}: Create unit tests for key functions`).join('\n')}`);
  }

  if (metrics.openIssuesAndPRs < 70) {
    suggestions.push(`🔍 Address open issues and PRs in ${repo.name}:\n   - Oldest issue: "${repo.topIssue}"\n   - Longest open PR: "${repo.oldestPR}"`);
  }

  if (metrics.documentationQuality < 70) {
    const undocumented = getUndocumentedFiles(repo);
    suggestions.push(`📚 Enhance documentation in ${repo.name}. Focus on these files:\n${undocumented.map(file => `   - ${file}: Add inline comments and improve function descriptions`).join('\n')}`);
  }

  return suggestions;
}

async function getTopIssue(repo: any, token: string): Promise<string> {
  try {
    const response = await axios.get(`https://api.github.com/repos/${repo.full_name}/issues?state=open&sort=created&direction=desc`, {
      headers: { Authorization: `token ${token}` },
    });
    return response.data[0]?.title || "No open issues";
  } catch (error) {
    console.error('Error fetching top issue:', error);
    return "Unable to fetch top issue";
  }
}

async function getOldestPR(repo: any, token: string): Promise<string> {
  try {
    const response = await axios.get(`https://api.github.com/repos/${repo.full_name}/pulls?state=open&sort=created&direction=asc`, {
      headers: { Authorization: `token ${token}` },
    });
    return response.data[0]?.title || "No open pull requests";
  } catch (error) {
    console.error('Error fetching oldest PR:', error);
    return "Unable to fetch oldest PR";
  }
}

function getMostComplexFunction(repo: any): string {
  // This would require analyzing the code, which is beyond the scope of the GitHub API
  // You might need to integrate with a code analysis tool for this
  return "Complexity analysis not available";
}

function getMostDuplicatedArea(repo: any): string {
  // This would also require code analysis
  return "Duplication analysis not available";
}

function getComplexFiles(repo: any): Array<{name: string, complexFunction: string}> {
  // This is a placeholder. In a real scenario, you'd use a code analysis tool.
  return [
    { name: 'src/components/ComplexComponent.tsx', complexFunction: 'handleUserInteraction' },
    { name: 'src/utils/dataProcessing.ts', complexFunction: 'processLargeDataSet' }
  ];
}

function getDuplicateAreas(repo: any): Array<{file: string, startLine: number, endLine: number, similarFile: string}> {
  // Placeholder for duplicate code detection
  return [
    { file: 'src/components/UserList.tsx', startLine: 45, endLine: 60, similarFile: 'src/components/AdminList.tsx' },
    { file: 'src/utils/validation.ts', startLine: 23, endLine: 35, similarFile: 'src/utils/formHandling.ts' }
  ];
}

function getUntestedFiles(repo: any): string[] {
  // Placeholder for identifying files lacking tests
  return ['src/utils/api.ts', 'src/components/DataVisualization.tsx'];
}

function getUndocumentedFiles(repo: any): string[] {
  // Placeholder for finding files with poor documentation
  return ['src/contexts/UserContext.tsx', 'src/hooks/useDataFetching.ts'];
}
