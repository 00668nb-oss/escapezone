import { useNavigate } from "react-router-dom";
import { useRegister } from "../hooks/useRegister";
import { useForm } from "react-hook-form";
import { ApiError } from "../api/client";
import { Alert, Button, Paper, Typography } from "@mui/material";
import { FormTextField } from "../components/FormTextField";

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
};

export function RegisterPage() {
  const navigate = useNavigate();
  const { mutate, isPending } = useRegister();
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>();

  function onSubmit(values: RegisterFormValues) {
    mutate(values, {
      onSuccess: () => navigate("/rooms"),
      onError: (error) => {
        if (error instanceof ApiError) {
          if (error.details) {
            for (const detail of error.details) {
              setError(detail.field as "name" | "email" | "password", {
                message: detail.message,
              });
            }
          }
          setError("root", { message: error.message });
        }
      },
    });
  }
  return (
    <Paper
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      sx={{ maxWidth: 420, mx: "auto", mt: 4, p: 4, display: "grid", gap: 2 }}
    >
      <Typography variant="h4" component="h1">
        הרשמה
      </Typography>
      <FormTextField
        label="שם"
        autoComplete="off"
        registration={register("name", {
          required: "חובה להזין שם",
          minLength: { value: 2, message: "שם קצר מדי" },
        })}
        errorMessage={errors.name?.message}
      />
      <FormTextField
        label="אימייל"
        type="email"
        autoComplete="off"
        registration={register("email", { required: "חובה להזין אימייל" })}
        errorMessage={errors.email?.message}
      />
      <FormTextField
        label="סיסמה"
        type="password"
        autoComplete="new-password"
        registration={register("password", {
          required: "חובה להזין סיסמה",
          minLength: { value: 8, message: "לפחות 8 תווים" },
        })}
        errorMessage={errors.password?.message}
      />
      {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
      <Button type="submit" variant="contained" size="large" disabled={isPending}>
        {isPending ? "נרשמים..." : "הרשמה"}
      </Button>
    </Paper>
  );
}
