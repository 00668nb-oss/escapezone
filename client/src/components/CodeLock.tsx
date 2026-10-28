import { Box, Button, Typography } from "@mui/material";

type CodeLockProps = {
  digits: number[]; // הספרות הנוכחיות, ספרה לכל גלגל
  onChange: (digits: number[]) => void;
};

// מנעול ספרות: לכל גלגל חץ למעלה, חץ למטה והספרה עצמה (0 עד 9 ובחזרה)
export function CodeLock({ digits, onChange }: CodeLockProps) {
  function change(index: number, step: number) {
    onChange(
      digits.map((digit, i) => (i === index ? (digit + step + 10) % 10 : digit)),
    );
  }

  return (
    <Box dir="ltr" sx={{ display: "flex", justifyContent: "center", gap: 2, my: 2 }}>
      {digits.map((digit, index) => (
        <Box key={index} sx={{ display: "grid", justifyItems: "center", gap: 0.5 }}>
          <Button size="small" aria-label="הגדלת ספרה" onClick={() => change(index, 1)}>
            ▲
          </Button>
          <Typography
            sx={{
              width: 56,
              height: 72,
              display: "grid",
              placeItems: "center",
              fontSize: "2.4rem",
              fontWeight: 800,
              fontFamily: "monospace",
              color: "secondary.main",
              bgcolor: "#0e0a18",
              border: 2,
              borderColor: "secondary.main",
              borderRadius: 2,
              boxShadow: "0 0 14px rgba(245, 194, 107, 0.35) inset",
            }}
          >
            {digit}
          </Typography>
          <Button size="small" aria-label="הקטנת ספרה" onClick={() => change(index, -1)}>
            ▼
          </Button>
        </Box>
      ))}
    </Box>
  );
}
