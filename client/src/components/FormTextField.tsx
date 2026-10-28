import { TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material";
import type { UseFormRegisterReturn } from "react-hook-form";

type FormTextFieldProps = Omit<
  TextFieldProps,
  "name" | "onChange" | "onBlur" | "inputRef" | "error" | "helperText"
> & {
  registration: UseFormRegisterReturn; // התוצאה של register("שם-שדה", כללים)
  errorMessage?: string; // errors.שם-שדה?.message
};

export function FormTextField({
  registration,
  errorMessage,
  slotProps,
  ...props
}: FormTextFieldProps) {
  const { ref, ...fieldProps } = registration;
  return (
    <TextField
      {...fieldProps}
      inputRef={ref}
      error={Boolean(errorMessage)}
      helperText={errorMessage}
      slotProps={{ ...slotProps, inputLabel: { shrink: true } }}
      {...props}
    />
  );
}
