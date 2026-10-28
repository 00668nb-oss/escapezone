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
import { Countdown } from "../components/Countdown";
import { EchoMessage } from "../components/EchoMessage";
import { PuzzlePanel } from "../components/PuzzlePanel";
import { Box, Button, Chip, LinearProgress, Stack, Typography } from "@mui/material";

// הודעות ECHO לפי מספר החידות שנפתרו (האחרונה חוזרת על עצמה)
const echoMessages = [
  "זוהתה כניסה לא מורשית. פרוטוקול נעילה הופעל. מצאו את הרמזים לפני שהזמן ייגמר.",
  "גישה חלקית אושרה. עוד חידות נותרו. שימו לב לפרטים.",
  "כמעט שם. חידה אחרונה לפני שהדלת תיפתח.",
];

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

  const heroSx = { display: "grid", gap: 2, maxWidth: "52rem", mx: "auto" };
  const imageSx = {
    width: "100%",
    aspectRatio: "16 / 9",
    objectFit: "cover",
    borderRadius: 3,
    border: 1,
    borderColor: "divider",
    display: "block",
  };

  if (progress.status === "not_started") {
    return (
      <Box sx={heroSx}>
        <Typography variant="h3" component="h1">
          {room.name}
        </Typography>
        <Box component="img" src={room.imageUrl} alt={room.name} sx={imageSx} />
        <Typography variant="body1">{room.description}</Typography>
        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
          <Chip label={difficultyLabels[room.difficulty]} color="primary" />
          <Chip label={room.category} variant="outlined" />
          <Chip label={`${room.timeLimit} דקות`} variant="outlined" />
          <Chip label={`${puzzles.length} חידות`} variant="outlined" />
        </Stack>
        <Button
          variant="contained"
          size="large"
          onClick={() => start(roomId)}
          disabled={isPending}
          sx={{ justifySelf: "start" }}
        >
          הכנסו לחדר
        </Button>
      </Box>
    );
  }

  const solvedCount = progress.solvedPuzzleIds.length;
  // החידה הראשונה שעוד לא נפתרה; החפצים שאחריה נעולים
  const nextIndex = puzzles.findIndex(
    (puzzle) => !progress.solvedPuzzleIds.includes(puzzle.id),
  );
  const echoText = echoMessages[Math.min(solvedCount, echoMessages.length - 1)];

  return (
    <Box sx={{ display: "grid", gap: 1.5, maxWidth: "72rem", mx: "auto" }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h4" component="h1">
          {room.name}
        </Typography>
        {progress.startedAt && (
          <Countdown
            storageKey={`timer:${room.id}:${progress.startedAt}`}
            minutes={room.timeLimit}
          />
        )}
      </Box>
      <EchoMessage key={echoText} text={echoText} />
      {/* גודל הסצנה מתאים לגובה המסך (יחס 16:9), כדי שהחדר כולו נראה בלי גלילה */}
      <Box
        sx={{
          position: "relative",
          width: "min(100%, calc((100svh - 330px) * 16 / 9))",
          minWidth: "min(100%, 480px)",
          mx: "auto",
        }}
      >
        <Box
          key={solvedCount}
          component="img"
          src={room.imageUrl}
          alt={room.name}
          className="flicker"
          sx={{
            ...imageSx,
            filter: `brightness(${0.5 + 0.17 * solvedCount})`,
            transition: "filter 1.2s",
          }}
        />
        {puzzles.map((puzzle, index) => (
          <HotspotButton
            key={puzzle.id}
            label={puzzle.hotspotLabel}
            position={index}
            solved={progress.solvedPuzzleIds.includes(puzzle.id)}
            locked={nextIndex !== -1 && index > nextIndex}
            onClick={() => setSelectedId(puzzle.id)}
          />
        ))}
      </Box>
      <LinearProgress
        variant="determinate"
        value={(solvedCount / puzzles.length) * 100}
        color="secondary"
        sx={{ height: 10, borderRadius: 5 }}
      />
      <Typography color="text.secondary">
        {solvedCount} מתוך {puzzles.length} חידות נפתרו
      </Typography>
      {selectedPuzzle && (
        <PuzzlePanel
          key={selectedPuzzle.id}
          puzzle={selectedPuzzle}
          onClose={() => setSelectedId(null)}
        />
      )}
    </Box>
  );
}
