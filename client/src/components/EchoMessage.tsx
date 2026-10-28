import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

type EchoMessageProps = {
  text: string;
};

// הודעה של ECHO שמוקלדת אות אחרי אות, כמו מסוף ישן
export function EchoMessage({ text }: EchoMessageProps) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (shown >= text.length) return;
    const timer = setTimeout(() => setShown(shown + 1), 35);
    return () => clearTimeout(timer);
  }, [shown, text]);

  return (
    <Box
      sx={{
        border: 1,
        borderColor: "rgba(111, 174, 122, 0.55)",
        p: 1.2,
        px: 1.8,
        bgcolor: "rgba(6, 12, 8, 0.82)",
        fontFamily: "var(--mono)",
        minHeight: 52,
      }}
    >
      <Typography component="span" color="success.main" sx={{ fontFamily: "inherit", fontWeight: 700 }}>
        ECHO &gt;{" "}
      </Typography>
      <Typography component="span" sx={{ fontFamily: "\"Assistant\", sans-serif", color: "#b6e3bf" }}>
        {text.slice(0, shown)}
        {shown < text.length && "▌"}
      </Typography>
    </Box>
  );
}
