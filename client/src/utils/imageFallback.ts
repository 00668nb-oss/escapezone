import type { SyntheticEvent } from "react";

export const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

// אם תמונה לא נטענת (כתובת שבורה), מחליפים אותה ברקע כהה במקום אייקון שבור
export function showPlaceholder(event: SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;
  if (!image.src.endsWith(PLACEHOLDER_IMAGE)) image.src = PLACEHOLDER_IMAGE;
}
