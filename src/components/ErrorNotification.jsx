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

export default ErrorNotification;
