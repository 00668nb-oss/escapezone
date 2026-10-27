import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useRoomPuzzles } from "../hooks/useRoomPuzzles";
import type { Puzzle } from "../types";
import { ErrorMessage } from "../components/ErrorMessage";
import { Loading } from "../components/Loading";
import { PuzzleForm } from "../components/PuzzleForm";

export function AdminPuzzlesPage() {
  const { id } = useParams();
  const roomId = Number(id);
  const [editing, setEditing] = useState<Puzzle | null>(null);
  const { data: puzzles, isLoading, error } = useRoomPuzzles(roomId);
  if (error) return <ErrorMessage error={error} />;
  if (isLoading || !puzzles) return <Loading />;
  return (
    <>
      <h1>ניהול חידות</h1>
      <Link to={`/admin`}>חזרה לחדרים</Link>
      <table className="admin-table">
        <thead>
          <tr>
            <th>סדר</th>
            <th>כותרת</th>
            <th>שם החפץ</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {puzzles.map((puzzle) => (
            <tr key={puzzle.id}>
              <td>{puzzle.order}</td>
              <td>{puzzle.title}</td>
              <td>{puzzle.hotspotLabel}</td>
              <td>
                <button type="button" onClick={() => setEditing(puzzle)}>
                  עריכה
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={() => setEditing(null)}>
        חידה חדשה
      </button>
      <PuzzleForm
        key={editing?.id ?? "new"}
        roomId={roomId}
        puzzle={editing ?? undefined}
        onDone={() => setEditing(null)}
      />
    </>
  );
}
