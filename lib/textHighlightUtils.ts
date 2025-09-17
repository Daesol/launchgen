// Utility functions for text highlighting

export interface HighlightedText {
  text: string;
  highlights: string[];
}

/**
 * Extracts potential highlight words from text using AI-like logic
 */
export function extractHighlightSuggestions(text: string): string[] {
  const words = text.split(/\s+/);
  const suggestions: string[] = [];
  
  // Common words that are often highlighted
  const highlightKeywords = [
    'AI', 'Smart', 'Fast', 'Easy', 'Best', 'Top', 'Leading', 'Innovative',
    'Revolutionary', 'Breakthrough', 'Advanced', 'Modern', 'Powerful',
    'Efficient', 'Professional', 'Expert', 'Premium', 'Elite', 'Ultimate'
  ];
  
  // Find words that match highlight keywords (case-insensitive)
  words.forEach(word => {
    const cleanWord = word.replace(/[^\w]/g, '');
    if (cleanWord.length > 2) {
      const isHighlightCandidate = highlightKeywords.some(keyword => 
        cleanWord.toLowerCase().includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(cleanWord.toLowerCase())
      );
      
      if (isHighlightCandidate && !suggestions.includes(cleanWord)) {
        suggestions.push(cleanWord);
      }
    }
  });
  
  return suggestions.slice(0, 3);
}

/**
 * Toggles highlight for a specific word
 */
export function toggleHighlight(
  word: string, 
  currentHighlights: string[]
): string[] {
  const normalizedWord = word.trim();
  const normalizedHighlights = currentHighlights.map(h => h.trim());
  
  if (normalizedHighlights.includes(normalizedWord)) {
    return normalizedHighlights.filter(h => h !== normalizedWord);
  } else {
    return [...normalizedHighlights, normalizedWord];
  }
}

/**
 * Validates if a word exists in the text
 */
export function isWordInText(word: string, text: string): boolean {
  const cleanWord = word.replace(/[^\w]/g, '');
  const cleanText = text.replace(/[^\w\s]/g, '');
  return cleanText.toLowerCase().includes(cleanWord.toLowerCase());
}

/**
 * Cleans up highlights array to only include words that exist in the text
 */
export function cleanupHighlights(highlights: string[], text: string): string[] {
  const textWords = text.split(' ').map(w => w.replace(/[^\w]/g, ''));
  return highlights.filter(highlight => textWords.includes(highlight));
} 