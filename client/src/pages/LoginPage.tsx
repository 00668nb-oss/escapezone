import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { useForm } from "react-hook-form";
import { ApiError } from "../api/client";
import { Alert, Button, Paper, Typography } from "@mui/material";
import { FormTextField } from "../components/FormTextField";

type LoginFormValues = {
  email: string;
  password: string;
};

export function LoginPage() {
  const navigate = useNavigate();
  const { mutate, isPending } = useLogin();
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>();

  function onSubmit(values: LoginFormValues) {
    mutate(values, {
      onSuccess: () => navigate("/rooms"),
      onError: (error) => {
        if (error instanceof ApiError) {
          if (error.details) {
            for (const detail of error.details) {
              setError(detail.field as "email" | "password", {
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
        כניסה
      </Typography>
      <FormTextField
        label="אימייל"
        type="email"
        registration={register("email", { required: "חובה להזין אימייל" })}
        errorMessage={errors.email?.message}
      />
      <FormTextField
        label="סיסמה"
        type="password"
        registration={register("password", { required: "חובה להזין סיסמה" })}
        errorMessage={errors.password?.message}
      />
      {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
      <Button type="submit" variant="contained" size="large" disabled={isPending}>
        {isPending ? "נכנסים..." : "כניסה"}
      </Button>
    </Paper>
  );
}
