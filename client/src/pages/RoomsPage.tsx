import { useSearchParams } from "react-router-dom";
import { RoomFiltersBar } from "../components/RoomFiltersBar";
import { Loading } from "../components/Loading";
import { ErrorMessage } from "../components/ErrorMessage";
import { useRooms } from "../hooks/useRooms";
import type { Difficulty, RoomFilters } from "../types";
import { useAllProgress } from "../hooks/useAllProgress";
import { RoomCard } from "../components/RoomCard";

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
      <h1>חדרי בריחה</h1>
      <RoomFiltersBar filters={filters} onChange={handleFiltersChange} />
      {isLoading && <Loading />}
      {error && <ErrorMessage error={error} />}
      {rooms?.length === 0 && <p className="rooms-empty">לא נמצאו חדרים</p>}
      <div className="rooms-grid">
        {rooms?.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            completed={progressList?.some(
              (p) => p.roomId === room.id && p.status === "completed",
            )}
          />
        ))}
      </div>
    </>
  );
}
