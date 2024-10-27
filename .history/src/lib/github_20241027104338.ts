import axios from 'axios';
import { Repository } from '@/types';

// Add this type definition at the top of the file
type Repository = {
  id: any;
  name: any;
  full_name: any;
  private: any;
  quality_score: number;
  metrics: any;
  suggestions: string[];
  personalizedSuggestions: string[];
  avatar_url: any;
  topIssue: string;
  oldestPR: string;
  complexFunction: string;
  duplicateArea: string;
};

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

export async function calculateQualityScore(repo: any, token: string): Promise<{ score: number; metrics: any; suggestions: string[] }> {
  if (repo.size === 0) {
    const emptyMetrics = {
      codeComplexity: 0,
      codeDuplication: 0,
      codeStyleConsistency: 0,
      testCoverage: 0,
      openIssuesAndPRs: 0,
      dependencyManagement: 0,
      documentationQuality: 0,
      commitFrequency: 0,
      branchingStrategy: 0
    };
    const suggestions = ["🚀 Your repository is empty. Start by adding a README.md file to describe your project and its purpose."];
    return { score: 0, metrics: emptyMetrics, suggestions };
  }

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
  const suggestions = await generateSuggestions(repo, metrics, token);

  return { score, metrics, suggestions };
}

export async function fetchRepositories(token: string): Promise<Repository[]> {
  try {
    console.log('Fetching user data...');
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${token}` },
    });
    const avatarUrl = userResponse.data.avatar_url;

    console.log('Fetching user repositories...');
    const repos = await fetchUserRepositories(token);
    console.log(`Found ${repos.length} repositories`);

    const processedRepos = await Promise.all(repos.map(async (repo: any) => {
      try {
        console.log(`Processing repository: ${repo.name}`);
        const { score, metrics, suggestions } = await calculateQualityScore(repo, token);
        const personalizedSuggestions = await generatePersonalizedSuggestions(repo, token);
        const { contents, error } = await fetchRepositoryContents(repo, token);

        return {
          id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          private: repo.private,
          quality_score: score,
          metrics: metrics,
          suggestions: suggestions,
          personalizedSuggestions: personalizedSuggestions,
          avatar_url: avatarUrl,
          topIssue: await getTopIssue(repo, token),
          oldestPR: await getOldestPR(repo, token),
          complexFunction: await getMostComplexFunction(repo, token, contents),
          duplicateArea: await getMostDuplicatedArea(repo, token, contents),
        };
      } catch (repoError) {
        console.error(`Error processing repository ${repo.name}:`, repoError);
        return null;
      }
    }));

    return processedRepos.filter((repo): repo is Repository => repo !== null);
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

async function generateSuggestions(repo: any, metrics: any, token: string): Promise<string[]> {
  const suggestions = [];

  if (repo.size === 0 || !metrics) {
    suggestions.push("🚀 Your repository is empty. Start by adding a README.md file to describe your project and its purpose.");
    return suggestions;
  }

  if (metrics.codeComplexity < 70) {
    suggestions.push(`🧠 Consider simplifying your codebase. Look for complex functions and break them down into smaller, more manageable pieces.`);
  }

  if (metrics.codeDuplication < 70) {
    suggestions.push(`🔄 There might be code duplication. Consider refactoring to reduce redundancy and improve maintainability.`);
  }

  if (metrics.testCoverage < 70) {
    suggestions.push(`🧪 Improve test coverage. Add more unit tests to ensure code reliability.`);
  }

  if (metrics.openIssuesAndPRs < 70) {
    suggestions.push(`🔍 Address open issues and PRs to improve project health and collaboration.`);
  }

  if (metrics.documentationQuality < 70) {
    suggestions.push(`📚 Enhance documentation. Focus on adding inline comments and improving function descriptions.`);
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

async function getMostComplexFunction(repo: any, token: string, contents: any[]): Promise<string> {
  const complexFiles = await getComplexFiles(repo, token, contents);
  return complexFiles.length > 0 ? `${complexFiles[0].name}: ${complexFiles[0].complexFunction}` : "Complexity analysis not available";
}

async function getMostDuplicatedArea(repo: any, token: string, contents: any[]): Promise<string> {
  const duplicateAreas = await getDuplicateAreas(repo, token, contents);
  return duplicateAreas.length > 0 ? `${duplicateAreas[0].file}: Lines ${duplicateAreas[0].startLine}-${duplicateAreas[0].endLine}` : "Duplication analysis not available";
}

async function getComplexFiles(repo: any, token: string, contents: any[]): Promise<Array<{name: string, complexFunction: string}>> {
  const complexFiles = [];

  for (const file of contents) {
    if (file.type === 'blob' && (file.path.endsWith('.ts') || file.path.endsWith('.tsx') || file.path.endsWith('.js') || file.path.endsWith('.jsx'))) {
      const fileContent = await fetchFileContent(repo, file.path, token);
      const complexity = analyzeComplexity(fileContent);
      if (complexity > 10) { // Arbitrary threshold
        complexFiles.push({ name: file.path, complexFunction: findMostComplexFunction(fileContent) });
      }
    }
  }

  return complexFiles.slice(0, 3); // Return top 3 complex files
}

async function getDuplicateAreas(repo: any, token: string, contents: any[]): Promise<Array<{file: string, startLine: number, endLine: number, similarFile: string}>> {
  const duplicateAreas = [];

  for (let i = 0; i < contents.length; i++) {
    for (let j = i + 1; j < contents.length; j++) {
      if (contents[i].type === 'blob' && contents[j].type === 'blob') {
        const file1Content = await fetchFileContent(repo, contents[i].path, token);
        const file2Content = await fetchFileContent(repo, contents[j].path, token);
        const duplicates = findDuplicates(file1Content, file2Content);
        duplicateAreas.push(...duplicates.map(d => ({
          file: contents[i].path,
          startLine: d.startLine1,
          endLine: d.endLine1,
          similarFile: contents[j].path
        })));
      }
    }
  }

  return duplicateAreas.slice(0, 3); // Return top 3 duplicate areas
}

async function getUntestedFiles(repo: any, token: string, contents: any[]): Promise<string[]> {
  const untestedFiles = [];

  for (const file of contents) {
    if (file.type === 'blob' && (file.path.endsWith('.ts') || file.path.endsWith('.tsx') || file.path.endsWith('.js') || file.path.endsWith('.jsx')) && !file.path.includes('test')) {
      const fileContent = await fetchFileContent(repo, file.path, token);
      if (!hasTests(fileContent)) {
        untestedFiles.push(file.path);
      }
    }
  }

  return untestedFiles.slice(0, 5); // Return top 5 untested files
}

async function getUndocumentedFiles(repo: any, token: string, contents: any[]): Promise<string[]> {
  const undocumentedFiles = [];

  for (const file of contents) {
    if (file.type === 'blob' && (file.path.endsWith('.ts') || file.path.endsWith('.tsx') || file.path.endsWith('.js') || file.path.endsWith('.jsx'))) {
      const fileContent = await fetchFileContent(repo, file.path, token);
      if (!isWellDocumented(fileContent)) {
        undocumentedFiles.push(file.path);
      }
    }
  }

  return undocumentedFiles.slice(0, 5); // Return top 5 undocumented files
}

async function fetchRepositoryContents(repo: any, token: string): Promise<{ contents: any[], error: string | null }> {
  try {
    const response = await axios.get(`https://api.github.com/repos/${repo.full_name}/contents`, {
      headers: { Authorization: `token ${token}` },
    });
    
    if (response.headers['x-ratelimit-remaining'] === '0') {
      const resetTime = new Date(Number(response.headers['x-ratelimit-reset']) * 1000);
      console.warn(`GitHub API rate limit reached. Resets at ${resetTime.toLocaleString()}`);
      return { contents: [], error: 'GitHub API rate limit reached' };
    }

    if (Array.isArray(response.data) && response.data.length === 0) {
      return { contents: [], error: 'Repository is empty' };
    }

    return { contents: response.data, error: null };
  } catch (error: any) {
    console.error(`Error fetching repository contents:`, error);
    return { contents: [], error: error.message || 'Unknown error occurred' };
  }
}

async function fetchFileContent(repo: any, path: string, token: string): Promise<string> {
  try {
    const response = await axios.get(`https://api.github.com/repos/${repo.full_name}/contents/${path}`, {
      headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' },
    });
    return Buffer.from(response.data.content, 'base64').toString('utf-8');
  } catch (error) {
    console.error(`Error fetching file content for ${path}:`, error);
    return '';
  }
}

function analyzeComplexity(content: string): number {
  // This is a simple complexity analysis. In a real-world scenario, you'd use a more sophisticated algorithm.
  const lines = content.split('\n');
  return lines.filter(line => line.includes('if') || line.includes('for') || line.includes('while')).length;
}

function findMostComplexFunction(content: string): string {
  // This is a placeholder. In a real scenario, you'd use a proper AST parser.
  const functionRegex = /function\s+(\w+)/g;
  const functions = content.match(functionRegex) || [];
  return functions[0]?.split(' ')[1] || 'Unknown';
}

function findDuplicates(content1: string, content2: string): Array<{startLine1: number, endLine1: number, startLine2: number, endLine2: number}> {
  // This is a simple implementation. In a real scenario, you'd use a more sophisticated algorithm.
  const lines1 = content1.split('\n');
  const lines2 = content2.split('\n');
  const duplicates = [];

  for (let i = 0; i < lines1.length - 5; i++) {
    for (let j = 0; j < lines2.length - 5; j++) {
      if (lines1.slice(i, i + 5).join('\n') === lines2.slice(j, j + 5).join('\n')) {
        duplicates.push({ startLine1: i + 1, endLine1: i + 5, startLine2: j + 1, endLine2: j + 5 });
      }
    }
  }

  return duplicates;
}

function hasTests(content: string): boolean {
  // This is a simple check. In a real scenario, you'd use a more sophisticated analysis.
  return content.includes('test(') || content.includes('it(') || content.includes('describe(');
}

function isWellDocumented(content: string): boolean {
  // This is a simple check. In a real scenario, you'd use a more sophisticated analysis.
  const lines = content.split('\n');
  const commentLines = lines.filter(line => line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*'));
  return commentLines.length / lines.length > 0.1; // Arbitrary threshold of 10% comments
}

async function generatePersonalizedSuggestions(repo: any, token: string): Promise<string[]> {
  if (repo.size === 0) {
    return ["🚀 Your repository is empty. Start by adding a README.md file to describe your project and its purpose."];
  }

  const suggestions: string[] = [];
  const { contents, error } = await fetchRepositoryContents(repo, token);

  if (error) {
    suggestions.push(`⚠️ Unable to analyze ${repo.name} contents: ${error}. Please check repository permissions.`);
    return suggestions;
  }

  if (contents.length === 0) {
    suggestions.push(`📂 No files found in ${repo.name}. Consider initializing your project with some basic files.`);
    return suggestions;
  }

  const untestedFiles = await getUntestedFiles(repo, token, contents);
  if (untestedFiles.length > 0) {
    suggestions.push(`🧪 Improve test coverage: Add tests for ${untestedFiles.slice(0, 3).join(', ')}${untestedFiles.length > 3 ? ` and ${untestedFiles.length - 3} more files` : ''}.`);
  }

  const undocumentedFiles = await getUndocumentedFiles(repo, token, contents);
  if (undocumentedFiles.length > 0) {
    suggestions.push(`📚 Enhance documentation: Focus on ${undocumentedFiles.slice(0, 3).join(', ')}${undocumentedFiles.length > 3 ? ` and ${undocumentedFiles.length - 3} more files` : ''}.`);
  }

  const complexFiles = await getComplexFiles(repo, token, contents);
  if (complexFiles.length > 0) {
    suggestions.push(`🧠 Simplify complex code: Refactor functions in ${complexFiles.slice(0, 3).map(f => f.name).join(', ')}${complexFiles.length > 3 ? ` and ${complexFiles.length - 3} more files` : ''}.`);
  }

  const duplicateAreas = await getDuplicateAreas(repo, token, contents);
  if (duplicateAreas.length > 0) {
    suggestions.push(`🔄 Reduce code duplication: Address similar code in ${duplicateAreas.slice(0, 2).map(d => `${d.file} (lines ${d.startLine}-${d.endLine})`).join(', ')}${duplicateAreas.length > 2 ? ` and ${duplicateAreas.length - 2} more areas` : ''}.`);
  }

  if (!repo.description) {
    suggestions.push(`📝 Add a clear and concise description to your repository to help others understand its purpose.`);
  }

  if (repo.open_issues_count > 10) {
    suggestions.push(`🔍 Address open issues: You have ${repo.open_issues_count} open issues. Consider setting up a triage process to manage them effectively.`);
  }

  if (new Date(repo.pushed_at) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
    suggestions.push(`⏰ Update your repository: It's been over a month since the last commit. Consider reviewing and updating your project.`);
  }

  return suggestions;
}

