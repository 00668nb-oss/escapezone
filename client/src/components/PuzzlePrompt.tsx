import { Box, Typography } from "@mui/material";

type PuzzlePromptProps = {
  text: string;
};

// מציג את נוסח החידה בצורה קריאה. סימן בתחילת שורה קובע את העיצוב:
// ">" פתק או ציטוט, "-" פריט ברשימה, "?" השאלה עצמה. שורה בלי סימן היא פסקה רגילה.
export function PuzzlePrompt({ text }: PuzzlePromptProps) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <Box sx={{ display: "grid", gap: 1, mb: 1.5 }}>
      {lines.map((line, index) => {
        if (line.startsWith(">")) {
          return (
            <Typography key={index} className="puzzle-quote">
              {line.slice(1).trim()}
            </Typography>
          );
        }
        if (line.startsWith("-")) {
          return (
            <Typography key={index} className="puzzle-clue">
              {line.slice(1).trim()}
            </Typography>
          );
        }
        if (line.startsWith("?")) {
          return (
            <Typography key={index} className="puzzle-question">
              {line.slice(1).trim()}
            </Typography>
          );
        }
        return (
          <Typography key={index} sx={{ lineHeight: 1.7, fontSize: "1rem" }}>
            {line}
          </Typography>
        );
      })}
    </Box>
  );
}
