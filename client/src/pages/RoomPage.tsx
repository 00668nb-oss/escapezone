import { Navigate, useParams } from "react-router-dom";
import { useRoom } from "../hooks/useRoom";
import { useStartRoom } from "../hooks/useStartRoom";
import { ErrorMessage } from "../components/ErrorMessage";
import { useRoomPuzzles } from "../hooks/useRoomPuzzles";
import { useProgress } from "../hooks/useProgress";
import { Loading } from "../components/Loading";
import { difficultyLabels } from "../constants/labels";
import { useState } from "react";
import { HotspotButton } from "../components/HotspotButton";
import { PuzzlePanel } from "../components/PuzzlePanel";

export function RoomPage() {
  const { id } = useParams();
  const roomId = Number(id);
  const {
    data: room,
    isLoading: roomLoading,
    error: roomError,
  } = useRoom(roomId);
  const {
    data: puzzles,
    isLoading: puzzlesLoading,
    error: puzzlesError,
  } = useRoomPuzzles(roomId);
  const {
    data: progress,
    isLoading: progressLoading,
    error: progressError,
  } = useProgress(roomId);

  const { mutate: start, isPending } = useStartRoom();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const error = roomError ?? puzzlesError ?? progressError;
  if (error) return <ErrorMessage error={error} />;

  if (
    roomLoading ||
    puzzlesLoading ||
    progressLoading ||
    !room ||
    !puzzles ||
    !progress
  )
    return <Loading />;

  if (progress.status === "completed")
    return <Navigate to={`/rooms/${roomId}/finish`} replace />;

  const selectedPuzzle = puzzles.find((puzzle) => puzzle.id === selectedId);

  if (progress.status === "not_started") {
    return (
      <div className="room-hero">
        <img src={room.imageUrl} alt={room.name} />
        <h1>{room.name}</h1>
        <p>{room.description}</p>
        <div className="room-card-meta">
          <span>{difficultyLabels[room.difficulty]}</span>
          <span>{room.category}</span>
          <span>{room.timeLimit} דק'</span>
          <span>{puzzles.length} חידות</span>
        </div>
        <button
          type="button"
          onClick={() => start(roomId)}
          disabled={isPending}
        >
          הכנסו לחדר
        </button>
      </div>
    );
  }
  return (
    <div className="room-hero">
      <h1>{room.name}</h1>
      <div className="room-scene">
        <img src={room.imageUrl} alt={room.name} />
        {puzzles.map((puzzle, index) => (
          <HotspotButton
            key={puzzle.id}
            label={puzzle.hotspotLabel}
            position={index}
            solved={progress.solvedPuzzleIds.includes(puzzle.id)}
            onClick={() => setSelectedId(puzzle.id)}
          />
        ))}
      </div>
      <progress value={progress.solvedPuzzleIds.length} max={puzzles.length} />
      <p className="room-progress">
        {progress.solvedPuzzleIds.length} מתוך {puzzles.length} חידות נפתרו
      </p>
      {selectedPuzzle && (
        <PuzzlePanel
          key={selectedPuzzle.id}
          puzzle={selectedPuzzle}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
