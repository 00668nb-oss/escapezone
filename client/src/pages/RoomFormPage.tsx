import { useNavigate, useParams } from "react-router-dom";
import type { Difficulty, Status } from "../types";
import { useRoom } from "../hooks/useRoom";
import { useSaveRoom } from "../hooks/useSaveRoom";
import { useForm } from "react-hook-form";
import { Loading } from "../components/Loading";
import { FormField } from "../components/FormField";
import { ErrorMessage } from "../components/ErrorMessage";
import { ApiError } from "../api/client";

type RoomFormValues = {
  name: string;
  description: string;
  imageUrl: string;
  difficulty: Difficulty;
  category: string;
  timeLimit: number;
  status: Status;
  finalText: string;
};

export function RoomFormPage() {
  const { id } = useParams();
  const roomId = id ? Number(id) : undefined;
  const isEdit = roomId !== undefined;
  const navigate = useNavigate();
  const { mutate, isPending } = useSaveRoom();
  const { data: room, isLoading, error } = useRoom(roomId);
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<RoomFormValues>({
    defaultValues: { difficulty: "easy", status: "draft", timeLimit: 30 },
    values: room
      ? {
          name: room.name,
          description: room.description,
          imageUrl: room.imageUrl,
          difficulty: room.difficulty,
          category: room.category,
          timeLimit: room.timeLimit,
          status: room.status,
          finalText: room.finalText ?? "",
        }
      : undefined,
  });
  const imageUrl = watch("imageUrl");
  function onSubmit(values: RoomFormValues) {
    mutate(
      { id: roomId, input: { ...values, finalText: values.finalText || null } },
      {
        onSuccess: () => navigate("/admin"),
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
        },
      },
    );
    if (error) return <ErrorMessage error={error} />;
    if (isLoading) return <Loading />;
  }
  return (
    <form className="admin-form" onSubmit={handleSubmit(onSubmit)}>
      <h1>{isEdit ? "עריכת חדר" : "חדר חדש"}</h1>
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
  );
}
