import type { SearchResult } from '@/types';

const BASE_URL = 'https://api.semanticscholar.org/graph/v1';
const API_KEY = process.env.SEMANTIC_SCHOLAR_API_KEY || '';

const FIELDS = 'title,authors,year,abstract,citationCount,openAccessPdf,externalIds,venue,publicationVenue';

export async function searchSemantic(query: string, maxResults = 15): Promise<SearchResult[]> {
  try {
    const params = new URLSearchParams({
      query,
      limit: maxResults.toString(),
      fields: FIELDS,
    });

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (API_KEY) {
      headers['x-api-key'] = API_KEY;
    }

    const response = await fetch(`${BASE_URL}/paper/search?${params}`, {
      headers,
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.status}`);
    }

    const data = await response.json();
    const papers = data.data || [];

    return papers.map((paper: SemanticPaper) => ({
      id: `semantic-${paper.paperId}`,
      title: paper.title || 'Untitled',
      authors: (paper.authors || []).slice(0, 5).map((a: { name: string }) => a.name),
      journal: paper.publicationVenue?.name || paper.venue || '',
      year: paper.year || new Date().getFullYear(),
      abstract: paper.abstract || '',
      doi: paper.externalIds?.DOI,
      pmid: paper.externalIds?.PubMed,
      citationCount: paper.citationCount || 0,
      openAccessPdf: paper.openAccessPdf?.url,
      source: 'semantic' as const,
    }));
  } catch (error) {
    console.error('Semantic Scholar search error:', error);
    return [];
  }
}

interface SemanticPaper {
  paperId: string;
  title: string;
  authors: Array<{ authorId: string; name: string }>;
  year: number;
  abstract: string;
  citationCount: number;
  openAccessPdf?: { url: string; status: string };
  externalIds?: {
    DOI?: string;
    PubMed?: string;
    ArXiv?: string;
  };
  venue?: string;
  publicationVenue?: {
    id: string;
    name: string;
    type: string;
  };
}
