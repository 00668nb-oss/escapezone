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

  function onSubmit(values: AnswerFormValues) {
    const answer = puzzle.codeLength ? digits.join("") : values.answer;
    mutate(
      { id: puzzle.id, answer },
      {
        onSuccess: (result) => {
          if (!result.correct) {
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

  if (puzzle.solved) {
    return (
      <ThemeProvider theme={paperTheme}>
        <Dialog
          open
          onClose={onClose}
          fullWidth
          maxWidth="sm"
          slotProps={{ backdrop }}
        >
          <DialogTitle>
            {caption}
            {puzzle.title}
          </DialogTitle>
          <DialogContent>
            <Alert severity="success" className="pop" sx={{ mb: 2 }}>
              הראיה נפתרה
            </Alert>
            <Typography className="story-text">{puzzle.storyText}</Typography>
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
        slotProps={{
          paper: { component: "form", onSubmit: handleSubmit(onSubmit) },
          backdrop,
        }}
      >
        <DialogTitle>
          {caption}
          {puzzle.title}
        </DialogTitle>
        <DialogContent>
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
            {puzzle.codeLength ? (
              <>
                <CodeLock
                  digits={digits}
                  onChange={(next) => {
                    setDigits(next);
                    clearErrors("answer"); // השדה לא רשום ב-React Hook Form, לכן מנקים את השגיאה ידנית
                  }}
                />
                {errors.answer && (
                  <Alert severity="error">{errors.answer.message}</Alert>
                )}
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
          {errors.root && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errors.root.message}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={onClose} disabled={isPending}>
            ביטול
          </Button>
          <Button type="submit" variant="contained" disabled={isPending}>
            {puzzle.codeLength ? "פתיחת המנעול" : "שליחה"}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
