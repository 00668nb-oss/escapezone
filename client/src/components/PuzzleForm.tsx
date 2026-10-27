import { register } from "../api/auth";
import { useSavePuzzle } from "../hooks/useSavePuzzle";
import type { Puzzle } from "../types";
import { FormField } from "./FormField";

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
  values: {
    puzzle ? { order: puzzle.order, answer: "" } : undefined;
  };
function onSubmit(values){
    const { answer, ...rest } = values;
    const input = answer ? values : rest;
    mutate({id: puzzle?.id, input},{onSuccess:()=>{reset(), onDone(), 
        onError: (saveError) => {
              if (saveError instanceof ApiError) {
                if (saveError.details) {
                  for (const detail of saveError.details) {
                    setError(detail.field as keyof RoomFormValues, {
                      message: detail.message,
                    });
                  }
                }
              }
              setError("root", { message: saveError.message });
            }}})
            return(
                <form className="admin-puzzle-form" onSubmit={handleSubmit(onSubmit)}>
<h2>{isEdit ? "עריכת חידה" : "חידה חדשה"}</h2>
<FormField label="שם" htmlFor="name" error={errors.name?.message}>
        <input
          id="name"
          type="text"
          {...register("name", {
            required: "חובה להזין שם",
            minLength: { value: 2, message: "שם קצר מדי" },
          })}
        />
      </FormField>

      <FormField
        label="תמונה"
        htmlFor="imageUrl"
        error={errors.imageUrl?.message}
      >
        <input
          id="imageUrl"
          type="url"
          {...register("imageUrl", { required: "חובה להזין תמונה" })}
        />
      </FormField>
      {imageUrl && (
        <img className="image-preview" src={imageUrl} alt="תצוגה מקדימה" />
      )}

      <FormField
        label="קטגוריה"
        htmlFor="category"
        error={errors.category?.message}
      >
        <input
          id="category"
          type="text"
          {...register("category", { required: "חובה להזין קטגוריה" })}
        />
      </FormField>

      <FormField
        label="תיאור"
        htmlFor="description"
        error={errors.description?.message}
      >
        <textarea
          id="description"
          {...register("description", { required: "חובה להזין תיאור" })}
        />
      </FormField>

      <FormField
        label="זמן"
        htmlFor="timeLimit"
        error={errors.timeLimit?.message}
      >
        <input
          id="timeLimit"
          type="number"
          {...register("timeLimit", {
            required: "חובה להזין זמן",
            valueAsNumber: true,
            min: { value: 1, message: "לפחות דקה" },
            max: { value: 180, message: "עד 180 דקות" },
          })}
        />
      </FormField>

      <FormField
        label="קושי"
        htmlFor="difficulty"
        error={errors.difficulty?.message}
      >
        <select id="difficulty" {...register("difficulty")}>
          <option value="easy">קל</option>
          <option value="medium">בינוני</option>
          <option value="hard">קשה</option>
        </select>
      </FormField>

      <FormField label="סטטוס" htmlFor="status" error={errors.status?.message}>
        <select id="status" {...register("status")}>
          <option value="draft">טיוטה</option>
          <option value="published">פורסם</option>
          <option value="archived">בארכיון</option>
        </select>
      </FormField>

      <FormField
        label="טקסט סיום (אופציונלי)"
        htmlFor="finalText"
        error={errors.finalText?.message}
      >
        <textarea id="finalText" {...register("finalText")} />
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
            )
}
}
