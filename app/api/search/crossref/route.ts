import { NextRequest, NextResponse } from 'next/server';
import type { SearchResult } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const maxResults = parseInt(searchParams.get('max') || '15');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter q is required' }, { status: 400 });
  }

  try {
    const params = new URLSearchParams({
      query,
      rows: Math.min(maxResults, 30).toString(),
      select: 'DOI,title,author,published,container-title,abstract,is-referenced-by-count',
      sort: 'relevance',
      order: 'desc',
    });

    const response = await fetch(
      `https://api.crossref.org/works?${params}`,
      {
        headers: {
          'User-Agent': 'ScholarAI Pro/1.0 (mailto:contact@scholaraipro.com)',
        },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      throw new Error(`CrossRef API error: ${response.status}`);
    }

    const data = await response.json();
    const items = data.message?.items || [];

    const results: SearchResult[] = items.map((item: CrossRefItem) => ({
      id: `crossref-${item.DOI?.replace(/\//g, '-') || Math.random().toString(36).slice(2)}`,
      title: Array.isArray(item.title) ? item.title[0] || 'Untitled' : 'Untitled',
      authors: (item.author || []).slice(0, 5).map((a: CrossRefAuthor) =>
        `${a.family || ''} ${(a.given || '').charAt(0)}`.trim()
      ),
      journal: Array.isArray(item['container-title'])
        ? item['container-title'][0] || ''
        : '',
      year: item.published?.['date-parts']?.[0]?.[0] || new Date().getFullYear(),
      abstract: item.abstract
        ? item.abstract.replace(/<[^>]+>/g, '').trim()
        : '',
      doi: item.DOI,
      citationCount: item['is-referenced-by-count'] || 0,
      source: 'crossref' as const,
    }));

    return NextResponse.json({ results, total: results.length });
  } catch (error) {
    console.error('CrossRef route error:', error);
    return NextResponse.json({ error: 'CrossRef search failed', results: [] }, { status: 500 });
  }
}

interface CrossRefAuthor {
  family?: string;
  given?: string;
}

interface CrossRefItem {
  DOI?: string;
  title?: string[];
  author?: CrossRefAuthor[];
  published?: { 'date-parts': number[][] };
  'container-title'?: string[];
  abstract?: string;
  'is-referenced-by-count'?: number;
}
