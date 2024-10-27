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

export async function calculateQualityScore(repo: any, token: string): Promise<{ score: number; metrics: any; suggestions: string[] }> {
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
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${token}` },
    });
    const avatarUrl = userResponse.data.avatar_url;

    const repos = await fetchUserRepositories(token);
    return Promise.all(repos.map(async (repo: any) => {
      const { score, metrics, suggestions } = await calculateQualityScore(repo, token);
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
        complexFunction: await getMostComplexFunction(repo, token),
        duplicateArea: await getMostDuplicatedArea(repo, token),
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

async function generateSuggestions(repo: any, metrics: any, token: string): Promise<string[]> {
  const suggestions = [];

  if (repo.size === 0) {
    suggestions.push("🚀 Your repository is empty. Start by adding a README.md file to describe your project and its purpose.");
    return suggestions;
  }

  if (metrics.codeComplexity < 70) {
    const complexFiles = await getComplexFiles(repo, token);
    suggestions.push(`🧠 Simplify your codebase in ${repo.name}. Focus on these files:\n${complexFiles.map(file => `   - ${file.name}: Consider breaking down the ${file.complexFunction} function.`).join('\n')}`);
  }

  if (metrics.codeDuplication < 70) {
    const duplicateAreas = await getDuplicateAreas(repo, token);
    suggestions.push(`🔄 Reduce code duplication in ${repo.name}. Address these areas:\n${duplicateAreas.map(area => `   - ${area.file}: Lines ${area.startLine}-${area.endLine} are similar to ${area.similarFile}`).join('\n')}`);
  }

  if (metrics.testCoverage < 70) {
    const untested = await getUntestedFiles(repo, token);
    suggestions.push(`🧪 Improve test coverage in ${repo.name}. Add tests for these files:\n${untested.map(file => `   - ${file}: Create unit tests for key functions`).join('\n')}`);
  }

  if (metrics.openIssuesAndPRs < 70) {
    suggestions.push(`🔍 Address open issues and PRs in ${repo.name}:\n   - Oldest issue: "${repo.topIssue}"\n   - Longest open PR: "${repo.oldestPR}"`);
  }

  if (metrics.documentationQuality < 70) {
    const undocumented = await getUndocumentedFiles(repo, token);
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

async function getMostComplexFunction(repo: any, token: string): Promise<string> {
  const complexFiles = await getComplexFiles(repo, token);
  return complexFiles.length > 0 ? `${complexFiles[0].name}: ${complexFiles[0].complexFunction}` : "Complexity analysis not available";
}

async function getMostDuplicatedArea(repo: any, token: string): Promise<string> {
  const duplicateAreas = await getDuplicateAreas(repo, token);
  return duplicateAreas.length > 0 ? `${duplicateAreas[0].file}: Lines ${duplicateAreas[0].startLine}-${duplicateAreas[0].endLine}` : "Duplication analysis not available";
}

async function getComplexFiles(repo: any, token: string): Promise<Array<{name: string, complexFunction: string}>> {
  const contents = await fetchRepositoryContents(repo, token);
  const complexFiles = [];

  for (const file of contents) {
    if (file.type === 'blob' && file.path.endsWith('.ts') || file.path.endsWith('.tsx')) {
      const fileContent = await fetchFileContent(repo, file.path, token);
      const complexity = analyzeComplexity(fileContent);
      if (complexity > 10) { // Arbitrary threshold
        complexFiles.push({ name: file.path, complexFunction: findMostComplexFunction(fileContent) });
      }
    }
  }

  return complexFiles.slice(0, 3); // Return top 3 complex files
}

async function getDuplicateAreas(repo: any, token: string): Promise<Array<{file: string, startLine: number, endLine: number, similarFile: string}>> {
  const contents = await fetchRepositoryContents(repo, token);
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

async function getUntestedFiles(repo: any, token: string): Promise<string[]> {
  const contents = await fetchRepositoryContents(repo, token);
  const untestedFiles = [];

  for (const file of contents) {
    if (file.type === 'blob' && (file.path.endsWith('.ts') || file.path.endsWith('.tsx')) && !file.path.includes('test')) {
      const fileContent = await fetchFileContent(repo, file.path, token);
      if (!hasTests(fileContent)) {
        untestedFiles.push(file.path);
      }
    }
  }

  return untestedFiles.slice(0, 5); // Return top 5 untested files
}

async function getUndocumentedFiles(repo: any, token: string): Promise<string[]> {
  const contents = await fetchRepositoryContents(repo, token);
  const undocumentedFiles = [];

  for (const file of contents) {
    if (file.type === 'blob' && (file.path.endsWith('.ts') || file.path.endsWith('.tsx'))) {
      const fileContent = await fetchFileContent(repo, file.path, token);
      if (!isWellDocumented(fileContent)) {
        undocumentedFiles.push(file.path);
      }
    }
  }

  return undocumentedFiles.slice(0, 5); // Return top 5 undocumented files
}

async function fetchRepositoryContents(repo: any, token: string): Promise<any[]> {
  try {
    const response = await axios.get(`https://api.github.com/repos/${repo.full_name}/git/trees/main?recursive=1`, {
      headers: { Authorization: `token ${token}` },
    });
    return response.data.tree;
  } catch (error) {
    console.error('Error fetching repository contents:', error);
    return [];
  }
}

async function fetchFileContent(repo: any, path: string, token: string): Promise<string> {
  try {
    const response = await axios.get(`https://api.github.com/repos/${repo.full_name}/contents/${path}`, {
      headers: { Authorization: `token ${token}` },
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
