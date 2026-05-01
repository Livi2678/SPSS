import { NextRequest, NextResponse } from 'next/server';
import { searchSemantic } from '@/lib/semantic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const maxResults = parseInt(searchParams.get('max') || '15');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter q is required' }, { status: 400 });
  }

  try {
    const results = await searchSemantic(query, Math.min(maxResults, 30));
    return NextResponse.json({ results, total: results.length });
  } catch (error) {
    console.error('Semantic Scholar route error:', error);
    return NextResponse.json({ error: 'Semantic Scholar search failed', results: [] }, { status: 500 });
  }
}
