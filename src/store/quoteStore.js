import { create } from 'zustand';
import { getRandomColor, buildTweetUrl } from '../utils/helpers';
import { COLORS, FALLBACK_QUOTES } from '../utils/constants';

const useQuoteStore = create((set, get) => ({
  // State
  quoteText: '',
  quoteAuthor: '',
  backgroundColor: '#4A90E2',
  loading: false,
  error: null,

  // Actions
  fetchQuote: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetch('https://quoteslate.vercel.app/api/quotes/random');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data?.quote && data?.author) {
        set({
          quoteText: data.quote,
          quoteAuthor: data.author,
          backgroundColor: getRandomColor(COLORS),
          loading: false,
          error: null
        });
      } else {
        throw new Error('Invalid data structure received from API');
      }
    } catch (error) {
      console.error('Failed to fetch quote:', error);

      // Graceful fallback
      const fallbackQuote = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
      set({
        quoteText: fallbackQuote.quote,
        quoteAuthor: fallbackQuote.author,
        backgroundColor: getRandomColor(COLORS),
        loading: false,
        error: 'Using offline quote due to network error'
      });
    }
  },

  // Computed values
  getTweetUrl: () => {
    const { quoteText, quoteAuthor } = get();
    return buildTweetUrl(quoteText, quoteAuthor);
  }
}));

export default useQuoteStore;
