import { useEffect } from 'react';
import { create } from 'zustand';

// Constants - easier to maintain and modify
const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
];

const FALLBACK_QUOTES = [
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
  { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" }
];

// Utility functions - pure functions for better testing
const getRandomColor = () => {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
};

const buildTweetUrl = (quote, author) => {
  const text = `"${quote}" - ${author}`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
};

// Enhanced store with better error handling and structure
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
          backgroundColor: getRandomColor(),
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
        backgroundColor: getRandomColor(),
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

// Loading component for better UX
const LoadingSpinner = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className="w-4 h-4 bg-current rounded-full animate-pulse"></div>
    <div className="w-4 h-4 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
    <div className="w-4 h-4 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
  </div>
);

// Error notification component
const ErrorNotification = ({ message, onDismiss }) => (
  <div className="absolute top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
    <div className="flex items-center justify-between">
      <span className="text-sm">{message}</span>
      <button
        onClick={onDismiss}
        className="ml-2 text-red-500 hover:text-red-700"
      >
        ✕
      </button>
    </div>
  </div>
);

function App() {
  const {
    quoteText,
    quoteAuthor,
    backgroundColor,
    fetchQuote,
    loading,
    error,
    getTweetUrl
  } = useQuoteStore();

  // Fetch initial quote
  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  const handleNewQuote = () => {
    if (!loading) {
      fetchQuote();
    }
  };

  const dismissError = () => {
    useQuoteStore.setState({ error: null });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center transition-colors duration-1000 ease-in-out relative"
      style={{ backgroundColor }}
    >
      {/* Error notification */}
      {error && (
        <ErrorNotification message={error} onDismiss={dismissError} />
      )}

      <div
        id="quote-box"
        className="max-w-2xl mx-auto my-10 p-8 rounded-2xl shadow-2xl text-center space-y-8 bg-white/95 backdrop-blur-sm border border-white/20"
      >
        {/* Quote text */}
        <div
          id="text"
          className="text-2xl md:text-3xl font-semibold leading-relaxed min-h-[120px] flex items-center justify-center transition-all duration-500"
          style={{ color: backgroundColor }}
        >
          {loading ? (
            <LoadingSpinner />
          ) : (
            <span>
              <span className="text-4xl opacity-50">"</span>
              {quoteText}
              <span className="text-4xl opacity-50">"</span>
            </span>
          )}
        </div>

        {/* Author */}
        <div
          id="author"
          className="text-right italic text-xl font-medium transition-all duration-500"
          style={{ color: backgroundColor }}
        >
          {loading ? '' : `— ${quoteAuthor}`}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap justify-center gap-4 pt-6">
          <button
            id="new-quote"
            className="px-6 py-3 rounded-lg transition-all duration-300 cursor-pointer text-white font-semibold hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            onClick={handleNewQuote}
            disabled={loading}
            style={{ backgroundColor }}
            aria-label="Get a new quote"
          >
            {loading ? 'Loading...' : 'New Quote'}
          </button>

          <a
            href={getTweetUrl()}
            target="_blank"
            rel="noopener noreferrer"
            id="tweet-quote"
            className="px-6 py-3 rounded-lg transition-all duration-300 text-white font-semibold hover:scale-105 hover:shadow-lg inline-flex items-center gap-2"
            style={{ backgroundColor }}
            aria-label="Share quote on Twitter"
          >
            <span>🐦</span>
            Tweet
          </a>

          <button
            className="px-6 py-3 rounded-lg transition-all duration-300 text-white font-semibold hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor }}
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Inspirational Quote',
                  text: `"${quoteText}" - ${quoteAuthor}`
                });
              } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(`"${quoteText}" - ${quoteAuthor}`);
                alert('Quote copied to clipboard!');
              }
            }}
            aria-label="Share quote"
          >
            <span>📱</span>
            Share
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
