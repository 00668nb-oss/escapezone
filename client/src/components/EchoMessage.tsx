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
        borderColor: "success.main",
        borderRadius: 2,
        p: 1.5,
        bgcolor: "rgba(6, 40, 28, 0.6)",
        fontFamily: "monospace",
        minHeight: 56,
      }}
    >
      <Typography component="span" color="success.main" sx={{ fontWeight: 800 }}>
        ECHO &gt;{" "}
      </Typography>
      <Typography component="span" color="success.light">
        {text.slice(0, shown)}
        {shown < text.length && "▌"}
      </Typography>
    </Box>
  );
}
