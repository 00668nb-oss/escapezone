import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useRoomPuzzles } from "../hooks/useRoomPuzzles";
import type { Puzzle } from "../types";
import { ErrorMessage } from "../components/ErrorMessage";
import { Loading } from "../components/Loading";
import { PuzzleForm } from "../components/PuzzleForm";
import {
  Box,
  Button,
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
    </>
  );
}
