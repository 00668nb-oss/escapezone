import { useEffect, useState } from "react";
import { Chip } from "@mui/material";

type CountdownProps = {
  storageKey: string; // מפתח לשמירת הזמן ששיחקו (משתנה בכל משחק חדש)
  minutes: number; // הזמן שהוקצב לחדר
};

function format(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function readElapsed(storageKey: string) {
  try {
    return Number(localStorage.getItem(storageKey)) || 0;
  } catch {
    return 0;
  }
}

// שעון עוצר: סופר רק את הזמן שבו נמצאים בחדר (והלשונית גלויה).
// כשיוצאים מהחדר הוא עוצר, וכשחוזרים הוא ממשיך מאותה נקודה.
export function Countdown({ storageKey, minutes }: CountdownProps) {
  const [elapsed, setElapsed] = useState(() => readElapsed(storageKey));

  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") setElapsed((seconds) => seconds + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, String(elapsed));
    } catch {
      // אם אי אפשר לשמור, השעון פשוט יתחיל מחדש בכניסה הבאה
    }
  }, [elapsed, storageKey]);

  const secondsLeft = Math.max(0, minutes * 60 - elapsed);
  const finished = secondsLeft === 0;

  return (
    <Chip
      label={finished ? "הזמן נגמר. אפשר להמשיך לשחק" : format(secondsLeft)}
      color={finished || secondsLeft <= 300 ? "error" : "secondary"}
      variant="outlined"
      sx={{ fontFamily: "var(--mono)", fontWeight: 700, fontSize: "1.15rem", py: 2.2, letterSpacing: "0.15em", border: 0, bgcolor: "rgba(9, 9, 10, 0.55)" }}
    />
  );
}
