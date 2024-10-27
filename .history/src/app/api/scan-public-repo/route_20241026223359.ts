import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url) {
    return NextResponse.json({ error: 'Repository URL is required' }, { status: 400 });
  }

  try {
    const [owner, repo] = url.split('/').slice(-2);
    
    const [repoData, issuesData, languagesData] = await Promise.all([
      octokit.repos.get({ owner, repo }),
      octokit.issues.listForRepo({ owner, repo, state: 'open' }),
      octokit.repos.listLanguages({ owner, repo }),
    ]);

    const languages = Object.keys(languagesData.data);
    const mainLanguage = languages.length > 0 ? languages[0] : 'N/A';

    const scanResult = {
      name: repoData.data.name,
      url: repoData.data.html_url,
      qualityScore: Math.floor(Math.random() * 100), // Replace with actual quality score calculation
      issuesCount: issuesData.data.length,
      starsCount: repoData.data.stargazers_count,
      language: mainLanguage,
      metrics: {
        codeComplexity: Math.floor(Math.random() * 100),
        codeDuplication: Math.floor(Math.random() * 100),
        codeStyleConsistency: Math.floor(Math.random() * 100),
        testCoverage: Math.floor(Math.random() * 100),
        openIssuesAndPRs: Math.floor(Math.random() * 100),
        dependencyManagement: Math.floor(Math.random() * 100),
        documentationQuality: Math.floor(Math.random() * 100),
        commitFrequency: Math.floor(Math.random() * 100),
        branchingStrategy: Math.floor(Math.random() * 100),
      },
      suggestions: [
        'Improve code coverage',
        'Refactor complex functions',
        'Update dependencies',
      ],
    };

    return NextResponse.json(scanResult);
  } catch (error) {
    console.error('Error scanning repository:', error);
    return NextResponse.json({ error: 'Error scanning repository' }, { status: 500 });
  }
}
