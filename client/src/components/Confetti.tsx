import { useMemo } from "react";
import { Box } from "@mui/material";

const colors = ["#f5c26b", "#8b5cf6", "#34d399", "#f87171", "#60a5fa"];

// קונפטי שנופל על המסך (האנימציה עצמה ב-index.css)
export function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 44 }, (_, id) => ({
        id,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 3,
        color: colors[id % colors.length],
      })),
    [],
  );

  return (
    <Box aria-hidden className="confetti">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            background: piece.color,
          }}
        />
      ))}
    </Box>
  );
}
