import { useEffect } from 'react';
import useQuoteStore from './store/quoteStore';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorNotification from './components/ErrorNotification';

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