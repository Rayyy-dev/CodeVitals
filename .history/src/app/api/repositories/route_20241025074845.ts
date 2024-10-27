import { NextRequest, NextResponse } from 'next/server';
import { fetchUserRepositories, calculateHealthScore } from '@/lib/github';

export async function GET(request: NextRequest) {
  const githubToken = request.cookies.get('github_token')?.value;

  if (!githubToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const repositories = await fetchUserRepositories(githubToken);
    const repositoriesWithHealth = repositories.map(repo => ({
      ...repo,
      health_score: calculateHealthScore(repo),
    }));

    return NextResponse.json(repositoriesWithHealth);
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return NextResponse.json({ error: 'Failed to fetch repositories' }, { status: 500 });
  }
}
