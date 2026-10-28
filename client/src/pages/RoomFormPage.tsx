import { useNavigate, useParams } from "react-router-dom";
import type { Difficulty, Status } from "../types";
import { useRoom } from "../hooks/useRoom";
import { useSaveRoom } from "../hooks/useSaveRoom";
import { useForm } from "react-hook-form";
import { Loading } from "../components/Loading";
import { FormTextField } from "../components/FormTextField";
import { ErrorMessage } from "../components/ErrorMessage";
import { ApiError } from "../api/client";
import { Alert, Box, Button, Paper, Typography } from "@mui/material";

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
    <Paper
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      sx={{ maxWidth: "38rem", mx: "auto", p: 4, display: "grid", gap: 2 }}
    >
      <Typography variant="h4" component="h1">
        {isEdit ? "עריכת חדר" : "חדר חדש"}
      </Typography>
      <FormTextField
        label="שם"
        registration={register("name", {
          required: "חובה להזין שם",
          minLength: { value: 2, message: "שם קצר מדי" },
        })}
        errorMessage={errors.name?.message}
      />
      <FormTextField
        label="כתובת תמונה"
        registration={register("imageUrl", { required: "חובה להזין תמונה" })}
        errorMessage={errors.imageUrl?.message}
      />
      {imageUrl && (
        <Box
          component="img"
          src={imageUrl}
          alt="תצוגה מקדימה"
          sx={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 2 }}
        />
      )}
      <FormTextField
        label="קטגוריה"
        registration={register("category", { required: "חובה להזין קטגוריה" })}
        errorMessage={errors.category?.message}
      />
      <FormTextField
        label="תיאור"
        multiline
        minRows={3}
        registration={register("description", { required: "חובה להזין תיאור" })}
        errorMessage={errors.description?.message}
      />
      <FormTextField
        label="זמן (בדקות)"
        type="number"
        registration={register("timeLimit", {
          required: "חובה להזין זמן",
          valueAsNumber: true,
          min: { value: 1, message: "לפחות דקה" },
          max: { value: 180, message: "עד 180 דקות" },
        })}
        errorMessage={errors.timeLimit?.message}
      />
      <FormTextField
        select
        label="קושי"
        slotProps={{ select: { native: true } }}
        registration={register("difficulty")}
        errorMessage={errors.difficulty?.message}
      >
        <option value="easy">קל</option>
        <option value="medium">בינוני</option>
        <option value="hard">קשה</option>
      </FormTextField>
      <FormTextField
        select
        label="סטטוס"
        slotProps={{ select: { native: true } }}
        registration={register("status")}
        errorMessage={errors.status?.message}
      >
        <option value="draft">טיוטה</option>
        <option value="published">פורסם</option>
        <option value="archived">בארכיון</option>
      </FormTextField>
      <FormTextField
        label="טקסט סיום (אופציונלי)"
        multiline
        minRows={3}
        registration={register("finalText")}
        errorMessage={errors.finalText?.message}
      />
      {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
      <Button type="submit" variant="contained" size="large" disabled={isPending}>
        {isPending ? "שומרים..." : "שמירה"}
      </Button>
    </Paper>
  );
}
