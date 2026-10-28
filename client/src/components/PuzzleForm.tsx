import { useForm } from "react-hook-form";
import { useSavePuzzle } from "../hooks/useSavePuzzle";
import type { Puzzle } from "../types";
import { FormTextField } from "./FormTextField";
import { ApiError } from "../api/client";
import { Alert, Button, Paper, Typography } from "@mui/material";

type PuzzleFormValues = {
  order: number;
  title: string;
  prompt: string;
  hotspotLabel: string;
  storyText: string;
  answer: string;
  hint: string | null;
  codeLength: number | null;
  hotspotX: number | null;
  hotspotY: number | null;
};
type PuzzleFormProps = { roomId: number; puzzle?: Puzzle; onDone: () => void };

export function PuzzleForm({ roomId, puzzle, onDone }: PuzzleFormProps) {
  const isEdit = Boolean(puzzle);
  const { mutate, isPending } = useSavePuzzle(roomId);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<PuzzleFormValues>({
    defaultValues: { order: 1, hint: null, codeLength: null, hotspotX: null, hotspotY: null },
    values: puzzle
      ? {
          order: puzzle.order,
          title: puzzle.title,
          prompt: puzzle.prompt,
          hotspotLabel: puzzle.hotspotLabel,
          storyText: puzzle.storyText ?? "",
          answer: "",
          hint: puzzle.hint ?? null,
          codeLength: puzzle.codeLength ?? null,
          hotspotX: puzzle.hotspotX ?? null,
          hotspotY: puzzle.hotspotY ?? null,
        }
      : undefined,
  });
  function onSubmit(values: PuzzleFormValues) {
    const { answer, ...rest } = values;
    const input = answer ? values : rest;
    mutate(
      { id: puzzle?.id, input },
      {
        onSuccess: () => {
          reset();
          onDone();
        },
        onError: (saveError) => {
          if (saveError instanceof ApiError) {
            if (saveError.details) {
              for (const detail of saveError.details) {
                setError(detail.field as keyof PuzzleFormValues, {
                  message: detail.message,
                });
              }
            }
          }
          setError("root", { message: saveError.message });
        },
      },
    );
  }
  return (
    <Paper
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      sx={{ mt: 4, p: 3, display: "grid", gap: 2, maxWidth: "38rem" }}
    >
      <Typography variant="h5" component="h2">
        {isEdit ? "עריכת חידה" : "חידה חדשה"}
      </Typography>
      <FormTextField
        label="סדר"
        type="number"
        registration={register("order", {
          required: "חובה להזין סדר",
          valueAsNumber: true,
          min: { value: 1, message: "לפחות 1" },
        })}
        errorMessage={errors.order?.message}
      />
      <FormTextField
        label="כותרת"
        registration={register("title", { required: "חובה להזין כותרת" })}
        errorMessage={errors.title?.message}
      />
      <FormTextField
        label="שאלה (אפשר: > פתק, - פריט ברשימה, ? השאלה)"
        multiline
        minRows={3}
        registration={register("prompt", { required: "חובה להזין שאלה" })}
        errorMessage={errors.prompt?.message}
      />
      <FormTextField
        label="שם החפץ"
        registration={register("hotspotLabel", { required: "חובה להזין את שם החפץ" })}
        errorMessage={errors.hotspotLabel?.message}
      />
      <FormTextField
        label="קטע סיפור"
        multiline
        minRows={3}
        registration={register("storyText", { required: "חובה להזין קטע סיפור" })}
        errorMessage={errors.storyText?.message}
      />
      <FormTextField
        label="רמז (אופציונלי)"
        registration={register("hint", {
          setValueAs: (value) => (value?.trim() ? value.trim() : null),
        })}
        errorMessage={errors.hint?.message}
      />
      <FormTextField
        label="מיקום החפץ בתמונה: אופקי, 0 עד 100 (אופציונלי)"
        type="number"
        registration={register("hotspotX", {
          setValueAs: (value) =>
            value === "" || value == null ? null : Number(value),
        })}
        errorMessage={errors.hotspotX?.message}
      />
      <FormTextField
        label="מיקום החפץ בתמונה: אנכי, 0 עד 100 (אופציונלי)"
        type="number"
        registration={register("hotspotY", {
          setValueAs: (value) =>
            value === "" || value == null ? null : Number(value),
        })}
        errorMessage={errors.hotspotY?.message}
      />
      <FormTextField
        label="אורך קוד (מנעול ספרות, אופציונלי)"
        type="number"
        registration={register("codeLength", {
          setValueAs: (value) =>
            value === "" || value == null ? null : Number(value),
        })}
        errorMessage={errors.codeLength?.message}
      />
      <FormTextField
        label={isEdit ? "תשובה חדשה (ריק = ללא שינוי)" : "תשובה"}
        registration={register("answer", {
          required: isEdit ? false : "חובה להזין תשובה",
        })}
        errorMessage={errors.answer?.message}
      />
      {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
      <Button type="submit" variant="contained" disabled={isPending}>
        {isPending ? "שומרים..." : "שמירה"}
      </Button>
    </Paper>
  );
}
