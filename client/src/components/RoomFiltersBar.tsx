import { FormField } from "./FormField";
import type { Difficulty, RoomFilters } from "../types";

export type RoomFiltersBarProps = {
  filters: RoomFilters;
  onChange: (filters: RoomFilters) => void;
};

export function RoomFiltersBar({ filters, onChange }: RoomFiltersBarProps) {
  return (
    <div className="room-filters">
      <FormField label="חיפוש" htmlFor="search">
        <input
          type="text"
          id="search"
          value={filters.search ?? ""}
          onChange={(event) =>
            onChange({ ...filters, search: event.target.value || undefined })
          }
        />
      </FormField>
      <FormField label="קטגוריה" htmlFor="category">
        <input
          type="text"
          id="category"
          value={filters.category ?? ""}
          onChange={(event) =>
            onChange({ ...filters, category: event.target.value || undefined })
          }
        />
      </FormField>
      <FormField label="קושי" htmlFor="difficulty">
        <select
          id="difficulty"
          value={filters.difficulty ?? ""}
          onChange={(event) =>
            onChange({
              ...filters,
              difficulty: (event.target.value || undefined) as
                | Difficulty
                | undefined,
            })
          }
        >
          <option value="">הכל</option>
          <option value="easy">קל</option>
          <option value="medium">בינוני</option>
          <option value="hard">קשה</option>
        </select>
      </FormField>
      <FormField label="מיון" htmlFor="sort">
        <select
          value={filters.sort ?? ""}
          id="sort"
          onChange={(event) =>
            onChange({
              ...filters,
              sort: (event.target.value || undefined) as RoomFilters["sort"],
            })
          }
        >
          <option value="">ברירת מחדל</option>
          <option value="name">שם</option>
          <option value="difficulty">קושי</option>
          <option value="timeLimit">זמן</option>
          <option value="category">קטגוריה</option>
        </select>
      </FormField>
    </div>
  );
}
