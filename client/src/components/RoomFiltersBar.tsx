import { Paper, TextField } from "@mui/material";
import type { Difficulty, RoomFilters } from "../types";

export type RoomFiltersBarProps = {
  filters: RoomFilters;
  onChange: (filters: RoomFilters) => void;
};

// שדות select מקוריים של הדפדפן: התווית תמיד "צפה" כי יש בהם אפשרות ריקה
const nativeSelect = {
  select: { native: true },
  inputLabel: { shrink: true },
};

export function RoomFiltersBar({ filters, onChange }: RoomFiltersBarProps) {
  return (
    <Paper sx={{ p: 2, mb: 3, display: "flex", flexWrap: "wrap", gap: 2 }}>
      <TextField
        label="חיפוש"
        value={filters.search ?? ""}
        onChange={(event) =>
          onChange({ ...filters, search: event.target.value || undefined })
        }
        sx={{ flex: "1 1 10rem" }}
      />
      <TextField
        label="קטגוריה"
        value={filters.category ?? ""}
        onChange={(event) =>
          onChange({ ...filters, category: event.target.value || undefined })
        }
        sx={{ flex: "1 1 10rem" }}
      />
      <TextField
        select
        label="קושי"
        value={filters.difficulty ?? ""}
        onChange={(event) =>
          onChange({
            ...filters,
            difficulty: (event.target.value || undefined) as
              | Difficulty
              | undefined,
          })
        }
        slotProps={nativeSelect}
        sx={{ flex: "1 1 10rem" }}
      >
        <option value="">הכל</option>
        <option value="easy">קל</option>
        <option value="medium">בינוני</option>
        <option value="hard">קשה</option>
      </TextField>
      <TextField
        select
        label="מיון"
        value={filters.sort ?? ""}
        onChange={(event) =>
          onChange({
            ...filters,
            sort: (event.target.value || undefined) as RoomFilters["sort"],
          })
        }
        slotProps={nativeSelect}
        sx={{ flex: "1 1 10rem" }}
      >
        <option value="">ברירת מחדל</option>
        <option value="name">שם</option>
        <option value="difficulty">קושי</option>
        <option value="timeLimit">זמן</option>
        <option value="category">קטגוריה</option>
      </TextField>
    </Paper>
  );
}
