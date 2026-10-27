import { useForm } from "react-hook-form";
import { useSubmitAnswer } from "../hooks/useSubmitAnswer";
import type { Puzzle } from "../types";
import { FormField } from "./FormField";

type AnswerFormValues = { answer: string };

type PuzzlePanelProps = {
  puzzle: Puzzle;
  onClose: () => void;
};

export function PuzzlePanel({ puzzle, onClose }: PuzzlePanelProps) {
  const { mutate, isPending } = useSubmitAnswer(puzzle.roomId);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AnswerFormValues>();

  function onSubmit(values: AnswerFormValues) {
    mutate(
      { id: puzzle.id, answer: values.answer },
      {
        onSuccess: (result) => {
          if (!result.correct) {
            setError("answer", { message: "תשובה שגויה, נסי שוב" });
          }
        },
        onError: (error) => setError("root", { message: error.message }),
      },
    );
  }

  if (puzzle.solved) {
    return (
      <div className="puzzle-panel">
        <h2>{puzzle.title}</h2>
        <p className="story-text">{puzzle.storyText}</p>
        <button type="button" onClick={onClose}>
          סגירה
        </button>
      </div>
    );
  }

  return (
    <div className="puzzle-panel">
      <h2>{puzzle.title}</h2>
      <p>{puzzle.prompt}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="התשובה"
          htmlFor="answer"
          error={errors.answer?.message}
        >
          <input
            type="text"
            id="answer"
            {...register("answer", { required: "חובה להזין תשובה" })}
          />
        </FormField>
        {errors.root && (
          <p role="alert" className="field-error">
            {errors.root.message}
          </p>
        )}
        <button type="submit" disabled={isPending}>
          שלחי
        </button>
        <button type="button" onClick={onClose} disabled={isPending}>
          ביטול
        </button>
      </form>
    </div>
  );
}
