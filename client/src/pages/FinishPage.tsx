import { ErrorMessage } from "../components/ErrorMessage";
import { Loading } from "../components/Loading";
import { useStory } from "../hooks/useStory";
import { useRestartRoom } from "../hooks/useRestartRoom";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ApiError } from "../api/client";
import { Alert, Box, Button, Paper, Typography } from "@mui/material";
import { Stamp } from "../components/Stamp";
import { DoorOpen } from "../components/DoorOpen";

export function FinishPage() {
  const { id } = useParams();
  const roomId = Number(id);
  const { data: story, isLoading, error } = useStory(roomId);
  const navigate = useNavigate();
  const { mutate: restart, isPending } = useRestartRoom();
  // נכנסו למסך הסיום בלי להשלים את החדר: חוזרים לחדר
  if (error instanceof ApiError && error.status === 403) {
    return <Navigate to={`/rooms/${roomId}`} replace />;
  }
  if (error) {
    return <ErrorMessage error={error} />;
  }
  if (isLoading || !story) return <Loading />;

  return (
    <Box sx={{ display: "grid", gap: 2, maxWidth: "46rem", mx: "auto" }}>
      <DoorOpen />
      <Stamp text="התיק נסגר" />
      <Typography variant="h3" component="h1">
        הסיפור המלא – {story.roomName}
      </Typography>
      <Alert severity="success">החקירה הושלמה. כל הראיות נאספו.</Alert>
      {story.puzzles.map((puzzle) => (
        <Paper key={puzzle.id} sx={{ p: 2 }}>
          <Typography variant="h6" component="h3" gutterBottom>
            {puzzle.title}
          </Typography>
          <Typography className="story-text">{puzzle.storyText}</Typography>
        </Paper>
      ))}
      {story.finalText && (
        <Typography className="final-text">{story.finalText}</Typography>
      )}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          disabled={isPending}
          onClick={() =>
            restart(roomId, { onSuccess: () => navigate(`/rooms/${roomId}`) })
          }
        >
          שחקו שוב
        </Button>
        <Button component={Link} to="/rooms" variant="outlined" color="inherit">
          חזרה לחדרים
        </Button>
      </Box>
    </Box>
  );
}
