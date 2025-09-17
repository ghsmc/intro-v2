export interface CitationSource {
  id: string;
  title: string;
  url: string;
  domain: string;
  snippet?: string;
  logo?: string;
}

export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

export function generateSourceId(url: string, index: number): string {
  const domain = extractDomain(url);
  return `${domain}-${index}`;
}

export function getFaviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
}

export function processSearchResults(results: any[]): CitationSource[] {
  return results.map((result, index) => ({
    id: generateSourceId(result.link || result.url, index),
    title: result.title || 'Untitled',
    url: result.link || result.url || '#',
    domain: extractDomain(result.link || result.url),
    snippet: result.snippet || result.description,
    logo: getFaviconUrl(extractDomain(result.link || result.url))
  }));
}

export function extractCitationsFromText(text: string, sources: CitationSource[]): {
  text: string;
  citations: CitationSource[];
} {
  // This function will be used to parse text and identify where citations should be inserted
  // For now, we'll return the text as-is and the sources
  return {
    text,
    citations: sources
  };
}
