import { useState } from "react";
import type { Status } from "../types";
import { useRooms } from "../hooks/useRooms";
import { ErrorMessage } from "../components/ErrorMessage";
import { Link } from "react-router-dom";
import { Loading } from "../components/Loading";
import { difficultyLabels, statusLabels } from "../constants/labels";
import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

export function AdminRoomsPage() {
  const [status, setStatus] = useState<Status | "">("");

  const {
    data: rooms,
    isLoading,
    error,
  } = useRooms(status ? { status } : undefined);

  if (error) return <ErrorMessage error={error} />;

  return (
    <>
      <Typography variant="h3" component="h1" gutterBottom>
        ניהול חדרים
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Button component={Link} to="/admin/rooms/new" variant="contained">
          חדר חדש
        </Button>
        <TextField
          select
          label="סינון לפי סטטוס"
          value={status}
          onChange={(event) => setStatus(event.target.value as Status | "")}
          slotProps={{ select: { native: true }, inputLabel: { shrink: true } }}
          sx={{ minWidth: 200 }}
        >
          <option value="">הכל</option>
          <option value="draft">טיוטה</option>
          <option value="published">פורסם</option>
          <option value="archived">בארכיון</option>
        </TextField>
      </Box>
      {isLoading && <Loading />}
      {rooms?.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: "center", py: 6 }}>
          אין חדרים
        </Typography>
      )}
      {rooms && rooms.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>שם</TableCell>
                <TableCell>קטגוריה</TableCell>
                <TableCell>קושי</TableCell>
                <TableCell>סטטוס</TableCell>
                <TableCell>פעולות</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id} hover>
                  <TableCell>{room.name}</TableCell>
                  <TableCell>{room.category}</TableCell>
                  <TableCell>{difficultyLabels[room.difficulty]}</TableCell>
                  <TableCell>
                    <Chip
                      label={statusLabels[room.status]}
                      size="small"
                      color={room.status === "published" ? "success" : "default"}
                    />
                  </TableCell>
                  <TableCell>
                    <Button component={Link} to={`/admin/rooms/${room.id}/edit`} size="small">
                      עריכה
                    </Button>
                    <Button component={Link} to={`/admin/rooms/${room.id}/puzzles`} size="small">
                      חידות
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
