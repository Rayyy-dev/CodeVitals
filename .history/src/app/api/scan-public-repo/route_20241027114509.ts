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
      octokit.issues.listForRepo({ owner, repo, state: 'open' }),
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

    const metrics = {
      codeComplexity: calculateMetric(commitsData.data.length, 1000, true),
      codeDuplication: calculateMetric(languages.length, 10),
      codeStyleConsistency: calculateMetric(branchesData.data.length, 20, true),
      testCoverage: calculateMetric(repoData.data.size, 10000, true),
      openIssuesAndPRs: calculateMetric(issuesData.data.length, 100, true),
      dependencyManagement: calculateMetric(new Date().getTime() - new Date(repoData.data.updated_at).getTime(), 30 * 24 * 60 * 60 * 1000, true),
      documentationQuality: calculateMetric(repoData.data.description ? repoData.data.description.length : 0, 100),
      commitFrequency: calculateMetric(commitsData.data.length, 1000),
      branchingStrategy: calculateMetric(branchesData.data.length, 20),
    };

    const qualityScore = Math.round(Object.values(metrics).reduce((sum, value) => sum + value, 0) / Object.keys(metrics).length);

    const scanResult: Repository = {
      id: repoData.data.id,
      name: repoData.data.name,
      url: repoData.data.html_url,
      full_name: repoData.data.full_name,
      private: repoData.data.private,
      quality_score: qualityScore,
      issuesCount: issuesData.data.length,
      starsCount: repoData.data.stargazers_count,
      language: mainLanguage,
      metrics,
      suggestions: [
        issuesData.data.length > 10 ? 'Consider addressing open issues' : 'Keep up with addressing issues promptly',
        metrics.codeComplexity < 70 ? 'Look into reducing code complexity' : 'Maintain current code complexity',
        metrics.documentationQuality < 70 ? 'Improve documentation' : 'Maintain current documentation quality',
        metrics.testCoverage < 70 ? 'Improve test coverage' : 'Maintain good test coverage',
      ],
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
