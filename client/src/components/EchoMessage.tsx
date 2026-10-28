import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

type EchoMessageProps = {
  text: string;
  compact?: boolean; // שורה דקה ושקופה, להצגה מעל תמונה
};

// הודעה של ECHO שמוקלדת אות אחרי אות, כמו מסוף ישן
export function EchoMessage({ text, compact = false }: EchoMessageProps) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (shown >= text.length) return;
    const timer = setTimeout(() => setShown(shown + 1), 35);
    return () => clearTimeout(timer);
  }, [shown, text]);

  return (
    <Box
      sx={{
        fontFamily: "var(--mono)",
        ...(compact
          ? {
              border: 1,
              borderColor: "rgba(111, 174, 122, 0.75)",
              bgcolor: "rgba(6, 14, 9, 0.5)",
              px: 1.5,
              py: 0.5,
              textShadow: "0 1px 6px rgba(0, 0, 0, 0.95)",
            }
          : {
              border: 1,
              borderColor: "rgba(111, 174, 122, 0.55)",
              p: 1.2,
              px: 1.8,
              bgcolor: "rgba(6, 12, 8, 0.82)",
              minHeight: 52,
            }),
      }}
    >
      <Typography
        component="span"
        color="success.main"
        sx={{ fontFamily: "inherit", fontWeight: 700, fontSize: compact ? "0.9rem" : undefined }}
      >
        ECHO &gt;{" "}
      </Typography>
      <Typography
        component="span"
        sx={{ fontFamily: "\"Assistant\", sans-serif", color: "#b6e3bf", fontSize: compact ? "0.95rem" : undefined }}
      >
        {text.slice(0, shown)}
        {shown < text.length && "▌"}
      </Typography>
    </Box>
  );
}
