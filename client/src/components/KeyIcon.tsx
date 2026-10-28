import { Box } from "@mui/material";

// מפתח עתיק אופקי: ראש מעוטר, גוף וזיפים. הצבע לפי color של האלמנט המכיל.
export function KeyIcon() {
  return (
    <Box
      component="svg"
      viewBox="0 0 72 28"
      aria-hidden
      sx={{ height: { xs: 22, md: 32 }, width: "auto", color: "#d4b46f", flexShrink: 0 }}
    >
      {/* ראש המפתח: טבעת כפולה עם עיטור */}
      <circle cx="14" cy="14" r="11" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="14" cy="14" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="14" cy="14" r="1.6" fill="currentColor" />
      <path d="M14 3v3M14 22v3M3 14h3M22 14h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* גוף המפתח */}
      <path d="M25 14h43" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M29 11.5v5M33 11.5v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      {/* זיפים */}
      <path d="M52 14v8h5v-8M62 14v6h5.5v-6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
    </Box>
  );
}
