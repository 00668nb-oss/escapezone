import { Box, CircularProgress, Typography } from "@mui/material";

type LoadingProps = {
  message?: string;
};

export function Loading({ message = "טוען..." }: LoadingProps) {
  return (
    <Box role="status" sx={{ py: 6, textAlign: "center" }}>
      <CircularProgress color="secondary" thickness={2} size={34} />
      <Typography color="text.secondary" sx={{ mt: 2, fontFamily: "var(--mono)" }}>
        {message}
      </Typography>
    </Box>
  );
}
