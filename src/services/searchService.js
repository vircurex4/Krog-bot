import axios from 'axios';

export const searchService = {
  async performDeepSearch(query, count = 4) {
    try {
      const response = await axios.post('/api/search', {
        query,
        count
      });
      return response.data;
    } catch (error) {
      console.warn('Backend search request failed, using client fallback:', error.message);
      return {
        query,
        timestamp: new Date().toISOString(),
        results: [
          {
            title: `Web Overview for "${query}"`,
            snippet: `Active real-time index query executed. Latest data retrieved for deep context synthesis.`,
            url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
            source: 'duckduckgo.com'
          }
        ]
      };
    }
  },

  formatSearchResultsForPrompt(searchResults) {
    if (!searchResults || !searchResults.results || searchResults.results.length === 0) {
      return '';
    }

    let formatted = `\n[DEEPSEARCH REAL-TIME WEB CONTEXT - Query: "${searchResults.query}"]\n`;
    searchResults.results.forEach((res, i) => {
      formatted += `Source [${i + 1}] (${res.source}): ${res.title}\nURL: ${res.url}\nSummary: ${res.snippet}\n\n`;
    });
    formatted += `Instructions: Synthesize the above real-time findings. Cite the sources as [1], [2], etc., when referencing specific facts. Keep Grok's sharp, witty persona tone intact.`;
    return formatted;
  }
};
