import type { Room } from "../types";
import { difficultyLabels } from "../constants/labels";
import { Link } from "react-router-dom";

export type RoomCardProps = {
  room: Room;
  completed?: boolean;
};

export function RoomCard({ room, completed }: RoomCardProps) {
  return (
    <Link to={`/rooms/${room.id}`} className="room-card">
      {completed && <span className="room-card-badge">הושלם ✓</span>}
      <img src={room.imageUrl} alt={room.name} />
      <div className="room-card-body">
        <h3>{room.name}</h3>
        <div className="room-card-meta">
          <span>{difficultyLabels[room.difficulty]}</span>
          <span>{room.category}</span>
          <span>{room.timeLimit} דק'</span>
        </div>
      </div>
    </Link>
  );
}
