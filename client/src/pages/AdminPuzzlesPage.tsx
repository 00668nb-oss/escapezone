import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useRoomPuzzles } from "../hooks/useRoomPuzzles";
import { useDeletePuzzle } from "../hooks/useDeletePuzzle";
import type { Puzzle } from "../types";
import { ErrorMessage } from "../components/ErrorMessage";
import { Loading } from "../components/Loading";
import { PuzzleForm } from "../components/PuzzleForm";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export function AdminPuzzlesPage() {
  const { id } = useParams();
  const roomId = Number(id);
  const [editing, setEditing] = useState<Puzzle | null>(null);
  // החידה שמבקשים למחוק (מציגה חלון אישור)
  const [deleting, setDeleting] = useState<Puzzle | null>(null);
  const remove = useDeletePuzzle(roomId);
  const { data: puzzles, isLoading, error } = useRoomPuzzles(roomId);
  if (error) return <ErrorMessage error={error} />;
  if (isLoading || !puzzles) return <Loading />;
  return (
    <>
      <Typography variant="h3" component="h1" gutterBottom>
        ניהול חידות
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button component={Link} to="/admin" variant="outlined" color="inherit">
          חזרה לחדרים
        </Button>
        <Button variant="contained" onClick={() => setEditing(null)}>
          חידה חדשה
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>סדר</TableCell>
              <TableCell>כותרת</TableCell>
              <TableCell>שם החפץ</TableCell>
              <TableCell>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {puzzles.map((puzzle) => (
              <TableRow key={puzzle.id} hover>
                <TableCell>{puzzle.order}</TableCell>
                <TableCell>{puzzle.title}</TableCell>
                <TableCell>{puzzle.hotspotLabel}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => setEditing(puzzle)}>
                    עריכה
                  </Button>
                  <Button size="small" color="error" onClick={() => setDeleting(puzzle)}>
                    מחיקה
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PuzzleForm
        key={editing?.id ?? "new"}
        roomId={roomId}
        puzzle={editing ?? undefined}
        onDone={() => setEditing(null)}
      />
      <Dialog open={deleting !== null} onClose={() => setDeleting(null)}>
        <DialogTitle>מחיקת חידה</DialogTitle>
        <DialogContent>
          <Typography>
            למחוק את החידה "{deleting?.title}"? הפעולה אינה הפיכה, והחידה תימחק גם
            מההתקדמות של השחקנים.
          </Typography>
          {remove.error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {remove.error.message}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setDeleting(null)}>
            ביטול
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={remove.isPending}
            onClick={() =>
              deleting &&
              remove.mutate(deleting.id, {
                onSuccess: () => {
                  if (editing?.id === deleting.id) setEditing(null);
                  setDeleting(null);
                },
              })
            }
          >
            מחיקה
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
