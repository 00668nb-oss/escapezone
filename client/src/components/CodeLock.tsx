import { Box, ButtonBase, Typography } from "@mui/material";

type CodeLockProps = {
  digits: number[]; // הספרות הנוכחיות, ספרה לכל חוגה
  onChange: (digits: number[]) => void;
};

const arrowSx = {
  width: 48,
  height: 22,
  fontSize: "0.8rem",
  color: "text.secondary",
  "&:hover": { color: "primary.main" },
};

// מנעול ספרות: לכל חוגה חץ למעלה, חץ למטה והספרה עצמה (0 עד 9 ובחזרה)
export function CodeLock({ digits, onChange }: CodeLockProps) {
  function change(index: number, step: number) {
    onChange(
      digits.map((digit, i) => (i === index ? (digit + step + 10) % 10 : digit)),
    );
  }

  return (
    <Box dir="ltr" sx={{ display: "flex", justifyContent: "center", gap: 1.5, my: 1 }}>
      {digits.map((digit, index) => (
        <Box key={index} sx={{ display: "grid", justifyItems: "center" }}>
          <ButtonBase aria-label="הגדלת ספרה" onClick={() => change(index, 1)} sx={arrowSx}>
            ▲
          </ButtonBase>
          <Typography
            sx={{
              width: 48,
              height: 56,
              display: "grid",
              placeItems: "center",
              fontSize: "2rem",
              fontWeight: 700,
              fontFamily: "var(--mono)",
              color: "#e6dcc4",
              bgcolor: "#1f1b16",
              border: "3px solid #3b342b",
              boxShadow: "inset 0 8px 14px rgba(0,0,0,0.6), inset 0 -8px 14px rgba(0,0,0,0.6)",
            }}
          >
            {digit}
          </Typography>
          <ButtonBase aria-label="הקטנת ספרה" onClick={() => change(index, -1)} sx={arrowSx}>
            ▼
          </ButtonBase>
        </Box>
      ))}
    </Box>
  );
}
