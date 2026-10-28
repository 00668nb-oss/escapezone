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
import { RoomScene } from "../components/RoomScene";

// מיקומי ברירת מחדל לחפצים (באחוזים), אם למנהלת לא הוגדר מיקום בחידה
const defaultPositions = [
  { x: 75, y: 28 },
  { x: 40, y: 58 },
  { x: 79, y: 73 },
  { x: 45, y: 25 },
  { x: 20, y: 50 },
];

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

  const positions = puzzles.map((puzzle, index) => {
    const fallback = defaultPositions[index % defaultPositions.length];
    return { x: puzzle.hotspotX ?? fallback.x, y: puzzle.hotspotY ?? fallback.y };
  });
  // המצלמה: זום חזק לחפץ שנבחר, ואחרת התקרבות עדינה אל החפץ הבא לפתרון
  const selectedIndex = puzzles.findIndex((puzzle) => puzzle.id === selectedId);
  const focusIndex = selectedIndex !== -1 ? selectedIndex : nextIndex;
  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
  const target = focusIndex !== -1 ? positions[focusIndex] : { x: 50, y: 50 };
  // בלי חיתוך של הצדדים: ההתקרבות העדינה נשארת קרובה למרכז, ורק בלחיצה המצלמה מתקרבת באמת
  const zoom = selectedIndex !== -1 ? 1.9 : 1.05;
  const focus =
    selectedIndex !== -1
      ? { x: clamp(target.x, 8, 92), y: clamp(target.y, 8, 92) }
      : { x: clamp(target.x, 35, 65), y: clamp(target.y, 35, 65) };

  const title = (
    <Typography
      variant="h5"
      component="h1"
      sx={{ fontWeight: 800, textShadow: "0 1px 8px rgba(0, 0, 0, 0.9)" }}
    >
      {room.name}
    </Typography>
  );
  const timer = progress.startedAt && (
    <Countdown
      storageKey={`timer:${room.id}:${progress.startedAt}`}
      minutes={room.timeLimit}
    />
  );
  const progressBlock = (
    <Box sx={{ display: "grid", gap: 0.5 }}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textShadow: "0 1px 6px rgba(0, 0, 0, 0.95)" }}
      >
        {solvedCount} מתוך {puzzles.length} חידות נפתרו
      </Typography>
      <LinearProgress
        variant="determinate"
        value={(solvedCount / puzzles.length) * 100}
        color="secondary"
      />
    </Box>
  );

  return (
    // במסך רחב התמונה ממלאת את כל גובה המסך, ולכן מבטלים את הריווח של העמוד סביבה
    <Box sx={{ width: "100%", minWidth: 0, mx: "auto", mt: { md: "-28px" }, mb: { md: "-48px" } }}>
      {/* במסך קטן: שם החדר, שעון והתקדמות מעל התמונה */}
      <Box
        sx={{
          display: { xs: "grid", md: "none" },
          gridTemplateColumns: "1fr auto",
          alignItems: "center",
          gap: 1,
          pb: 1.5,
        }}
      >
        {title}
        {timer}
        <Box sx={{ gridColumn: "1 / -1" }}>{progressBlock}</Box>
      </Box>
      <RoomScene
        imageUrl={room.imageUrl}
        alt={room.name}
        brightness={0.6 + 0.13 * solvedCount}
        flickerKey={solvedCount}
        focusX={focus.x}
        focusY={focus.y}
        zoom={zoom}
        overlay={
          // במסך רחב: הכול שקוף מעל התמונה. למעלה שם החדר, התקדמות ושעון; למטה שורת ECHO דקה
          <>
            <Box
              sx={{
                position: "absolute",
                top: 0,
                insetInline: 0,
                zIndex: 3,
                display: { xs: "none", md: "grid" },
                gridTemplateColumns: "auto 1fr auto",
                alignItems: "center",
                gap: 3,
                px: 3,
                py: 1.5,
                background: "linear-gradient(rgba(0, 0, 0, 0.5), transparent)",
                pointerEvents: "none",
              }}
            >
              {title}
              {progressBlock}
              {timer}
            </Box>
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                insetInline: 0,
                zIndex: 3,
                display: { xs: "none", md: "block" },
                px: 3,
                py: 1.5,
                background: "linear-gradient(transparent, rgba(0, 0, 0, 0.45))",
                pointerEvents: "none",
              }}
            >
              <EchoMessage key={echoText} text={echoText} compact />
            </Box>
          </>
        }
      >
        {puzzles.map((puzzle, index) => (
          <HotspotButton
            key={puzzle.id}
            label={puzzle.hotspotLabel}
            number={index + 1}
            x={positions[index].x}
            y={positions[index].y}
            solved={progress.solvedPuzzleIds.includes(puzzle.id)}
            locked={nextIndex !== -1 && index > nextIndex}
            onClick={() => setSelectedId(puzzle.id)}
          />
        ))}
      </RoomScene>
      {/* במסך קטן: הודעת ECHO מתחת לתמונה */}
      <Box sx={{ display: { xs: "block", md: "none" }, pt: 1.5 }}>
        <EchoMessage key={echoText} text={echoText} />
      </Box>
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
