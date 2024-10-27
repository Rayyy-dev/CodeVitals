import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { Repository } from '@/types';

const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url) {
    return NextResponse.json({ error: 'Repository URL is required' }, { status: 400 });
  }

  try {
    const [owner, repo] = url.split('/').slice(-2);
    
    if (!owner || !repo) {
      return NextResponse.json({ error: 'Invalid repository URL' }, { status: 400 });
    }

    const [repoData, issuesData, languagesData, commitsData, branchesData, contributorsData] = await Promise.all([
      octokit.repos.get({ owner, repo }),
      octokit.issues.listForRepo({ owner, repo, state: 'all' }),
      octokit.repos.listLanguages({ owner, repo }),
      octokit.repos.listCommits({ owner, repo, per_page: 100 }),
      octokit.repos.listBranches({ owner, repo }),
      octokit.repos.listContributors({ owner, repo }),
    ]);

    const languages = Object.keys(languagesData.data);
    const mainLanguage = languages.length > 0 ? languages[0] : 'N/A';

    const calculateMetric = (value: number, max: number, inverse = false): number => {
      const score = inverse ? (max - value) / max : value / max;
      return Math.min(Math.max(Math.round(score * 100), 0), 100);
    };

    const cycComplexity = calculateMetric(commitsData.data.length, 1000, true);
    const codeDuplication = calculateMetric(languages.length, 10);
    const codeCoverage = calculateMetric(repoData.data.size, 10000, true);
    const possibleBugs = calculateMetric(issuesData.data.filter(issue => issue.labels.some(label => label.name.toLowerCase().includes('bug'))).length, 50, true);
    const codeSmells = calculateMetric(branchesData.data.length, 20, true);
    const vulnerabilities = calculateMetric(repoData.data.open_issues_count, 100, true);
    const maintainability = calculateMetric(contributorsData.data.length, 20);

    const metrics = {
      cycComplexity,
      codeDuplication,
      codeCoverage,
      possibleBugs,
      codeSmells,
      vulnerabilities,
      maintainability,
    };

    const qualityScore = Math.round(
      (cycComplexity + codeDuplication + codeCoverage + possibleBugs + codeSmells + vulnerabilities + maintainability) / 7
    );

    const scanResult: Repository = {
      id: repoData.data.id,
      name: repoData.data.name,
      url: repoData.data.html_url,
      full_name: repoData.data.full_name,
      private: repoData.data.private,
      quality_score: qualityScore,
      issuesCount: repoData.data.open_issues_count,
      starsCount: repoData.data.stargazers_count,
      language: mainLanguage,
      metrics,
      suggestions: generateSuggestions(metrics),
      topIssue: issuesData.data[0]?.title || 'No open issues',
      oldestPR: 'N/A', // You'll need to fetch PR data to populate this
      complexFunction: 'N/A', // You'll need to implement logic to identify complex functions
      duplicateArea: 'N/A', // You'll need to implement logic to identify duplicate code areas
    };

    return NextResponse.json(scanResult);
  } catch (error) {
    console.error('Error scanning repository:', error);
    return NextResponse.json({ error: 'Error scanning repository' }, { status: 500 });
  }
}

function generateSuggestions(metrics: any): string[] {
  const suggestions = [];
  if (metrics.cycComplexity < 70) suggestions.push('Consider reducing code complexity');
  if (metrics.codeDuplication < 70) suggestions.push('Address code duplication issues');
  if (metrics.codeCoverage < 70) suggestions.push('Improve test coverage');
  if (metrics.possibleBugs < 70) suggestions.push('Focus on fixing potential bugs');
  if (metrics.codeSmells < 70) suggestions.push('Refactor to address code smells');
  if (metrics.vulnerabilities < 70) suggestions.push('Address security vulnerabilities');
  if (metrics.maintainability < 70) suggestions.push('Improve code maintainability');
  return suggestions;
}
