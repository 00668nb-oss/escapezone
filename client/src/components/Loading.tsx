import { Box, CircularProgress, Typography } from "@mui/material";

type LoadingProps = {
  message?: string;
};

export function Loading({ message = "טוען..." }: LoadingProps) {
  return (
    <Box role="status" sx={{ py: 6, textAlign: "center" }}>
      <CircularProgress color="secondary" />
      <Typography color="text.secondary" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  );
}
