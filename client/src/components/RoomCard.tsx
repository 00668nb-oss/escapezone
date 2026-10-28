import { Link } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import type { Room } from "../types";
import { difficultyLabels } from "../constants/labels";

export type RoomCardProps = {
  room: Room;
  completed?: boolean;
};

export function RoomCard({ room, completed }: RoomCardProps) {
  return (
    <Card sx={{ position: "relative", height: "100%" }}>
      <CardActionArea component={Link} to={`/rooms/${room.id}`} sx={{ height: "100%" }}>
        {completed && (
          <Chip
            label="הושלם ✓"
            color="success"
            size="small"
            sx={{ position: "absolute", top: 12, insetInlineStart: 12, zIndex: 1, fontWeight: 700 }}
          />
        )}
        <CardMedia
          component="img"
          image={room.imageUrl}
          alt={room.name}
          sx={{ aspectRatio: "16 / 9" }}
        />
        <CardContent>
          <Typography variant="h6" component="h3" gutterBottom>
            {room.name}
          </Typography>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
            <Chip label={difficultyLabels[room.difficulty]} size="small" color="primary" />
            <Chip label={room.category} size="small" variant="outlined" />
            <Chip label={`${room.timeLimit} דקות`} size="small" variant="outlined" />
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
