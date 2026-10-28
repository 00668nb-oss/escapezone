import { Alert, Button } from "@mui/material";

type ErrorMessageProps = {
  error: Error | null;
  onRetry?: () => void;
};

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  if (!error) return null;
  return (
    <Alert
      severity="error"
      action={
        onRetry && (
          <Button color="inherit" size="small" onClick={onRetry}>
            נסו שוב
          </Button>
        )
      }
    >
      {error.message}
    </Alert>
  );
}
