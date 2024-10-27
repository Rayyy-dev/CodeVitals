import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Repository URL is required' }, { status: 400 });
  }

  try {
    const [owner, repo] = url.split('/').slice(-2);
    
    const [repoData, issuesData, languagesData, commitsData, branchesData] = await Promise.all([
      octokit.repos.get({ owner, repo }),
      octokit.issues.listForRepo({ owner, repo, state: 'open' }),
      octokit.repos.listLanguages({ owner, repo }),
      octokit.repos.listCommits({ owner, repo }),
      octokit.repos.listBranches({ owner, repo }),
    ]);

    const languages = Object.keys(languagesData.data);
    const mainLanguage = languages.length > 0 ? languages[0] : 'N/A';

    // Calculate actual metrics
    const openIssuesCount = issuesData.data.length;
    const starsCount = repoData.data.stargazers_count;
    const commitCount = commitsData.data.length;
    const branchCount = branchesData.data.length;

    const calculateMetric = (value: number, max: number, inverse = false): number => {
      const score = inverse ? (max - value) / max : value / max;
      return Math.min(Math.max(Math.round(score * 100), 0), 100);
    };

    const metrics = {
      codeComplexity: calculateMetric(commitCount, 1000, true),
      codeDuplication: calculateMetric(languages.length, 10),
      codeStyleConsistency: calculateMetric(branchCount, 20, true),
      openIssuesAndPRs: calculateMetric(openIssuesCount, 100, true),
      dependencyManagement: calculateMetric(repoData.data.updated_at ? new Date().getTime() - new Date(repoData.data.updated_at).getTime() : 0, 30 * 24 * 60 * 60 * 1000, true),
      documentationQuality: calculateMetric(repoData.data.description ? repoData.data.description.length : 0, 100),
      commitFrequency: calculateMetric(commitCount, 1000),
      branchingStrategy: calculateMetric(branchCount, 20),
    };

    const qualityScore = Math.round(Object.values(metrics).reduce((sum, value) => sum + value, 0) / Object.keys(metrics).length);

    const scanResult = {
      name: repoData.data.name,
      url: repoData.data.html_url,
      qualityScore,
      issuesCount: openIssuesCount,
      starsCount,
      language: mainLanguage,
      metrics,
      suggestions: [
        openIssuesCount > 10 ? 'Consider addressing open issues' : 'Keep up with addressing issues promptly',
        metrics.codeComplexity < 70 ? 'Look into reducing code complexity' : 'Maintain current code complexity',
        metrics.documentationQuality < 70 ? 'Improve documentation' : 'Maintain current documentation quality',
      ],
    };

    return NextResponse.json(scanResult);
  } catch (error) {
    console.error('Error scanning repository:', error);
    return NextResponse.json({ error: 'Error scanning repository' }, { status: 500 });
  }
}
