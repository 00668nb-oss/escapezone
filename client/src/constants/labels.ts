import type { Difficulty, Status } from "../types";

export const difficultyLabels: Record<Difficulty, string> = {
  easy: "קל",
  medium: "בינוני",
  hard: "קשה",
};

export const statusLabels: Record<Status, string> = {
  draft: "טיוטה",
  published: "פורסם",
  archived: "בארכיון",
};
