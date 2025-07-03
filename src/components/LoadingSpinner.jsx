const LoadingSpinner = () => (
  <div role="status" className="flex items-center justify-center space-x-2">
    <div className="w-4 h-4 bg-current rounded-full animate-pulse"></div>
    <div className="w-4 h-4 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
    <div className="w-4 h-4 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    <span className="sr-only">Loading...</span>
  </div>
);

export default LoadingSpinner;
