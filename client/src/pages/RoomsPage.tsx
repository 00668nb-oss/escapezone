import { useSearchParams } from "react-router-dom";
import { RoomFiltersBar } from "../components/RoomFiltersBar";
import { Loading } from "../components/Loading";
import { ErrorMessage } from "../components/ErrorMessage";
import { useRooms } from "../hooks/useRooms";
import type { Difficulty, RoomFilters } from "../types";
import { useAllProgress } from "../hooks/useAllProgress";
import { RoomCard } from "../components/RoomCard";
import { Box, Typography } from "@mui/material";

export function RoomsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters: RoomFilters = {
    search: searchParams.get("search") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    difficulty: (searchParams.get("difficulty") ?? undefined) as
      | Difficulty
      | undefined,
    sort: (searchParams.get("sort") ?? undefined) as RoomFilters["sort"],
  };

  function handleFiltersChange(next: RoomFilters) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
    }
    setSearchParams(params);
  }
  const { data: rooms, isLoading, error } = useRooms(filters);
  const { data: progressList } = useAllProgress();
  return (
    <>
      <Typography variant="h3" component="h1" gutterBottom>
        חדרי בריחה
      </Typography>
      <RoomFiltersBar filters={filters} onChange={handleFiltersChange} />
      {isLoading && <Loading />}
      {error && <ErrorMessage error={error} />}
      {rooms?.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: "center", py: 6 }}>
          לא נמצאו חדרים
        </Typography>
      )}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(17rem, 1fr))",
          gap: 3,
        }}
      >
        {rooms?.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            completed={progressList?.some(
              (p) => p.roomId === room.id && p.status === "completed",
            )}
          />
        ))}
      </Box>
    </>
  );
}
