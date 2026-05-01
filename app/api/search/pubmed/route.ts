import { NextRequest, NextResponse } from 'next/server';
import { searchPubMed } from '@/lib/pubmed';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const maxResults = parseInt(searchParams.get('max') || '20');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter q is required' }, { status: 400 });
  }

  try {
    const results = await searchPubMed(query, Math.min(maxResults, 50));
    return NextResponse.json({ results, total: results.length });
  } catch (error) {
    console.error('PubMed route error:', error);
    return NextResponse.json({ error: 'PubMed search failed', results: [] }, { status: 500 });
  }
}
