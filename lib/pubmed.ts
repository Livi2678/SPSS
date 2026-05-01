import type { SearchResult } from '@/types';

const BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
const API_KEY = process.env.PUBMED_API_KEY || '';

export async function searchPubMed(query: string, maxResults = 20): Promise<SearchResult[]> {
  try {
    // Step 1: esearch to get PMIDs
    const esearchParams = new URLSearchParams({
      db: 'pubmed',
      term: query,
      retmax: maxResults.toString(),
      retmode: 'json',
      sort: 'relevance',
      ...(API_KEY && { api_key: API_KEY }),
    });

    const esearchRes = await fetch(`${BASE_URL}/esearch.fcgi?${esearchParams}`, {
      next: { revalidate: 300 },
    });

    if (!esearchRes.ok) throw new Error('PubMed esearch failed');

    const esearchData = await esearchRes.json();
    const pmids: string[] = esearchData.esearchresult?.idlist || [];

    if (pmids.length === 0) return [];

    // Step 2: efetch to get full records
    const efetchParams = new URLSearchParams({
      db: 'pubmed',
      id: pmids.join(','),
      retmode: 'xml',
      rettype: 'abstract',
      ...(API_KEY && { api_key: API_KEY }),
    });

    const efetchRes = await fetch(`${BASE_URL}/efetch.fcgi?${efetchParams}`, {
      next: { revalidate: 300 },
    });

    if (!efetchRes.ok) throw new Error('PubMed efetch failed');

    const xmlText = await efetchRes.text();
    return parsePubMedXml(xmlText);
  } catch (error) {
    console.error('PubMed search error:', error);
    return [];
  }
}

function parsePubMedXml(xml: string): SearchResult[] {
  const results: SearchResult[] = [];

  // Extract PubmedArticle blocks
  const articleMatches = xml.match(/<PubmedArticle>[\s\S]*?<\/PubmedArticle>/g) || [];

  for (const articleXml of articleMatches) {
    try {
      const pmid = extractTag(articleXml, 'PMID') || '';
      const title = cleanText(extractTag(articleXml, 'ArticleTitle') || '');
      const abstract = cleanText(extractAbstract(articleXml));
      const journal = cleanText(extractTag(articleXml, 'ISOAbbreviation') || extractTag(articleXml, 'Title') || '');
      const year = extractYear(articleXml);
      const authors = extractAuthors(articleXml);
      const doi = extractDoi(articleXml);

      if (title && pmid) {
        results.push({
          id: `pubmed-${pmid}`,
          title,
          authors,
          journal,
          year,
          abstract,
          pmid,
          doi,
          source: 'pubmed',
        });
      }
    } catch {
      // Skip malformed records
    }
  }

  return results;
}

function extractTag(xml: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : null;
}

function extractAbstract(xml: string): string {
  const abstractSection = xml.match(/<Abstract>([\s\S]*?)<\/Abstract>/);
  if (!abstractSection) return '';

  const texts = abstractSection[1].match(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g) || [];
  return texts
    .map(t => {
      const labelMatch = t.match(/Label="([^"]+)"/);
      const textMatch = t.match(/>([^<]+)</);
      const label = labelMatch ? `${labelMatch[1]}: ` : '';
      const text = textMatch ? textMatch[1] : '';
      return `${label}${text}`;
    })
    .join(' ')
    .trim();
}

function extractYear(xml: string): number {
  const yearMatch = xml.match(/<PubDate>[\s\S]*?<Year>(\d{4})<\/Year>/);
  return yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear();
}

function extractAuthors(xml: string): string[] {
  const authorMatches = xml.match(/<Author[^>]*>[\s\S]*?<\/Author>/g) || [];
  return authorMatches.slice(0, 5).map(authorXml => {
    const lastName = extractTag(authorXml, 'LastName') || '';
    const initials = extractTag(authorXml, 'Initials') || '';
    return `${lastName} ${initials}`.trim();
  });
}

function extractDoi(xml: string): string | undefined {
  const doiMatch = xml.match(/IdType="doi">([^<]+)<\/ArticleId>/);
  return doiMatch ? doiMatch[1] : undefined;
}

function cleanText(text: string): string {
  return text
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}
