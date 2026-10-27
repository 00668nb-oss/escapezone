import { useState } from "react";
import type { Status } from "../types";
import { useRooms } from "../hooks/useRooms";
import { ErrorMessage } from "../components/ErrorMessage";
import { Link } from "react-router-dom";
import { FormField } from "../components/FormField";
import { Loading } from "../components/Loading";
import { difficultyLabels, statusLabels } from "../constants/labels";

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
      <h1>ניהול חדרים</h1>
      <div className="admin-toolbar">
        <Link to="/admin/rooms/new">חדר חדש</Link>
        <FormField label="סינון לפי סטטוס" htmlFor="status-filter">
          <select
            id="status-filter"
            value={status}
            onChange={(event) => setStatus(event.target.value as Status | "")}
          >
            <option value="">הכל</option>
            <option value="draft">טיוטה</option>
            <option value="published">פורסם</option>
            <option value="archived">בארכיון</option>
          </select>
        </FormField>
      </div>
      {isLoading && <Loading />}
      {rooms?.length === 0 && <p className="rooms-empty">אין חדרים</p>}
      {rooms && rooms.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>שם</th>
              <th>קטגוריה</th>
              <th>קושי</th>
              <th>סטטוס</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td>{room.name}</td>
                <td>{room.category}</td>
                <td>{difficultyLabels[room.difficulty]}</td>
                <td>{statusLabels[room.status]}</td>
                <td>
                  <Link to={`/admin/rooms/${room.id}/edit`}>עריכה</Link>
                  <Link to={`/admin/rooms/${room.id}/puzzles`}>חידות</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
