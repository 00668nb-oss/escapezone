import { useForm } from "react-hook-form";
import { useSavePuzzle } from "../hooks/useSavePuzzle";
import type { Puzzle } from "../types";
import { FormField } from "./FormField";
import { ApiError } from "../api/client";

type PuzzleFormValues = {
  order: number;
  title: string;
  prompt: string;
  hotspotLabel: string;
  storyText: string;
  answer: string;
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
    defaultValues: { order: 1 },
    values: puzzle
      ? {
          order: puzzle.order,
          title: puzzle.title,
          prompt: puzzle.prompt,
          hotspotLabel: puzzle.hotspotLabel,
          storyText: puzzle.storyText ?? "",
          answer: "",
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
    <form className="admin-puzzle-form" onSubmit={handleSubmit(onSubmit)}>
      <h2>{isEdit ? "עריכת חידה" : "חידה חדשה"}</h2>
      <FormField label="סדר" htmlFor="order" error={errors.order?.message}>
        <input
          id="order"
          type="number"
          {...register("order", {
            required: "חובה להזין סדר",
            minLength: { value: 2, message: "שם קצר מדי" },
          })}
        />
      </FormField>

      <FormField label="כותרת" htmlFor="title" error={errors.title?.message}>
        <input
          id="title"
          type="text"
          {...register("title", { required: "חובה להזין כותרת" })}
        />
      </FormField>

      <FormField label="שאלה" htmlFor="prompt" error={errors.prompt?.message}>
        <input
          id="prompt"
          type="textarea"
          {...register("prompt", { required: "חובה להזין שאלה" })}
        />
      </FormField>

      <FormField
        label="שם החפץ"
        htmlFor="hotspotLabel"
        error={errors.hotspotLabel?.message}
      >
        <input
          id="hotspotLabel"
          type="text"
          {...register("hotspotLabel", { required: "חובה להזין את שם החפץ" })}
        />
      </FormField>

      <FormField
        label="קטע סיפור"
        htmlFor="storyText"
        error={errors.storyText?.message}
      >
        <input
          id="storyText"
          type="text"
          {...register("storyText", {
            required: "חובה להזין קטע סיפור",
          })}
        />
      </FormField>

      <FormField label="תשובה" htmlFor="answer" error={errors.answer?.message}>
        <input
          id="answer"
          type="text"
          {...register("answer", {
            required: isEdit ? false : "חובה להזין תשובה",
          })}
        />
      </FormField>

      {errors.root && (
        <p role="alert" className="field-error">
          {errors.root.message}
        </p>
      )}
      <button type="submit" disabled={isPending}>
        שמירה
      </button>
    </form>
  );
}
