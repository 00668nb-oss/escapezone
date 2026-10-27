import { useNavigate } from "react-router-dom";
import { useRegister } from "../hooks/useRegister";
import { useForm } from "react-hook-form";
import { FormField } from "../components/FormField";
import { ApiError } from "../api/client";

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>הרשמה</h1>
      <FormField label="שם" htmlFor="name" error={errors.name?.message}>
        <input
          type="text"
          id="name"
          {...register("name", {
            required: "חובה להזין שם",
            minLength: { value: 2, message: "שם קצר מדי" },
          })}
        />
      </FormField>
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
          {...register("password", {
            required: "חובה להזין סיסמה",
            minLength: { value: 8, message: "לפחות 8 תווים" },
          })}
        />
      </FormField>
      {errors.root && (
        <p role="alert" className="field-error">
          {errors.root.message}
        </p>
      )}
      <button type="submit" disabled={isPending}>
        הרשמה
      </button>
    </form>
  );
}
