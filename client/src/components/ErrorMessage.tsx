type ErrorMessageProps = {
  error: Error | null;
  onRetry?: () => void;
};

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  if (!error) return null;
  return (
    <div role="alert">
      <p>{error.message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry}>
          נסי שוב
        </button>
      )}
    </div>
  );
}
