import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSubmitAnswer } from "../hooks/useSubmitAnswer";
import type { Puzzle } from "../types";
import { FormTextField } from "./FormTextField";
import { CodeLock } from "./CodeLock";
import { PuzzlePrompt } from "./PuzzlePrompt";
import { paperTheme } from "../theme";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ThemeProvider,
  Typography,
} from "@mui/material";

type AnswerFormValues = { answer: string };

type PuzzlePanelProps = {
  puzzle: Puzzle;
  onClose: () => void;
};

const backdrop = { sx: { backgroundColor: "rgba(0, 0, 0, 0.35)" } };

// חלון קומפקטי: שוליים קטנים כדי שיישאר מקום, וגלגלת דקה בצבע הדיו (לא הגלגלת האפורה הרחבה)
const dialogSx = {
  "& .MuiDialog-paper": { m: 1.5, maxHeight: "calc(100% - 24px)" },
};
const contentSx = {
  py: 1,
  scrollbarWidth: "thin",
  scrollbarColor: "rgba(31, 27, 22, 0.35) transparent",
  "&::-webkit-scrollbar": { width: 6 },
  "&::-webkit-scrollbar-track": { background: "transparent" },
  "&::-webkit-scrollbar-thumb": { background: "rgba(31, 27, 22, 0.35)", borderRadius: 3 },
};

export function PuzzlePanel({ puzzle, onClose }: PuzzlePanelProps) {
  const { mutate, isPending } = useSubmitAnswer(puzzle.roomId);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<AnswerFormValues>();
  // חידה עם codeLength מציגה מנעול ספרות במקום שדה טקסט
  const [digits, setDigits] = useState<number[]>(() =>
    Array(puzzle.codeLength ?? 0).fill(0),
  );
  // מספר הניסיונות השגויים: כשהוא משתנה, התוכן מתנער מחדש
  const [wrongAttempts, setWrongAttempts] = useState(0);
  // הרמז מוצג רק אחרי שמבקשים אותו
  const [showHint, setShowHint] = useState(false);
  // אחרי תשובה נכונה עוברים מיד למסך ההצלחה, בלי לחכות שהנתונים יתרעננו מהשרת
  const [justSolved, setJustSolved] = useState(false);

  function onSubmit(values: AnswerFormValues) {
    const answer = puzzle.codeLength ? digits.join("") : values.answer;
    mutate(
      { id: puzzle.id, answer },
      {
        onSuccess: (result) => {
          if (result.correct) {
            setJustSolved(true);
          } else {
            setError("answer", { message: "תשובה שגויה, נסו שוב" });
            setWrongAttempts((count) => count + 1);
          }
        },
        onError: (error) => setError("root", { message: error.message }),
      },
    );
  }

  const caption = (
    <Typography
      component="span"
      sx={{ display: "block", fontFamily: "var(--mono)", fontSize: "0.8rem", letterSpacing: "0.12em", color: "text.secondary" }}
    >
      ראיה מספר {puzzle.order}
    </Typography>
  );

  if (puzzle.solved || justSolved) {
    return (
      <ThemeProvider theme={paperTheme}>
        <Dialog
          open
          onClose={onClose}
          fullWidth
          maxWidth="sm"
          sx={dialogSx}
          slotProps={{ backdrop }}
        >
          <DialogTitle sx={{ py: 1.5 }}>
            {caption}
            {puzzle.title}
          </DialogTitle>
          <DialogContent sx={contentSx}>
            <Alert severity="success" className="pop" sx={{ mb: 2 }}>
              הראיה נפתרה
            </Alert>
            <Typography className="story-text">
              {puzzle.storyText ?? "טוענים את קטע הסיפור..."}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>סגירה</Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={paperTheme}>
      <Dialog
        open
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        sx={dialogSx}
        slotProps={{
          paper: { component: "form", onSubmit: handleSubmit(onSubmit) },
          backdrop,
        }}
      >
        <DialogTitle sx={{ py: 1.5 }}>
          {caption}
          {puzzle.title}
        </DialogTitle>
        <DialogContent sx={contentSx}>
          <Box key={wrongAttempts} className={wrongAttempts > 0 ? "shake" : undefined}>
            <PuzzlePrompt text={puzzle.prompt} />
            {puzzle.hint &&
              (showHint ? (
                <Alert severity="info" icon={false} sx={{ mb: 2 }}>
                  <strong>רמז:</strong> {puzzle.hint}
                </Alert>
              ) : (
                <Button size="small" color="secondary" onClick={() => setShowHint(true)} sx={{ mb: 2 }}>
                  צריכים רמז?
                </Button>
              ))}
            {errors.root && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.root.message}
              </Alert>
            )}
            {puzzle.codeLength && errors.answer && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.answer.message}
              </Alert>
            )}
            {puzzle.codeLength ? (
              <>
                <CodeLock
                  digits={digits}
                  onChange={(next) => {
                    setDigits(next);
                    clearErrors("answer"); // השדה לא רשום ב-React Hook Form, לכן מנקים את השגיאה ידנית
                  }}
                />
              </>
            ) : (
              <FormTextField
                label="התשובה"
                autoFocus
                registration={register("answer", { required: "חובה להזין תשובה" })}
                errorMessage={errors.answer?.message}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={onClose} disabled={isPending}>
            ביטול
          </Button>
          <Button type="submit" variant="contained" disabled={isPending}>
            {isPending ? "בודקים..." : puzzle.codeLength ? "פתיחת המנעול" : "שליחה"}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
