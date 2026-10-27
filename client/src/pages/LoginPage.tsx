import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { useForm } from "react-hook-form";
import { FormField } from "../components/FormField";
import { ApiError } from "../api/client";

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>כניסה</h1>
      <FormField label="אימייל" htmlFor="email" error={errors.email?.message}>
        <input
          type="email"
          id="email"
          {...register("email", { required: "חובה להזין אימייל" })}
        />
      </FormField>
      <FormField
        label="סיסמה"
        htmlFor="password"
        error={errors.password?.message}
      >
        <input
          type="password"
          id="password"
          {...register("password", { required: "חובה להזין סיסמה" })}
        />
      </FormField>
      {errors.root && (
        <p role="alert" className="field-error">
          {errors.root.message}
        </p>
      )}
      <button type="submit" disabled={isPending}>
        כניסה
      </button>
    </form>
  );
}
