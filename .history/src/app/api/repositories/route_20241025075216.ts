import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { calculateHealthScore } from '@/lib/github';

export async function GET(request: NextRequest) {
  const githubToken = request.cookies.get('github_token')?.value;

  if (!githubToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await axios.get('https://api.github.com/user/repos', {
      headers: {
        Authorization: `token ${githubToken}`,
      },
    });

    const repositories = response.data.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      health_score: calculateHealthScore(repo),
    }));

    return NextResponse.json(repositories);
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return NextResponse.json({ error: 'Failed to fetch repositories' }, { status: 500 });
  }
}
