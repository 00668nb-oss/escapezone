import { Link } from "react-router-dom";
import {
  Box,
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

// כרטיס חדר בסגנון תיק בארכיון: לשונית עם מספר תיק, ואם נפתר, חותמת
export function RoomCard({ room, completed }: RoomCardProps) {
  return (
    <Box className="case-card">
      <CardActionArea component={Link} to={`/rooms/${room.id}`} sx={{ height: "100%" }}>
        <Box className="case-tab">תיק מס׳ {String(room.id).padStart(3, "0")}</Box>
        <Box sx={{ position: "relative" }}>
          {completed && <Box className="stamp-mark">נסגר</Box>}
          <CardMedia
            component="img"
            image={room.imageUrl}
            alt={room.name}
            sx={{ aspectRatio: "16 / 9" }}
          />
        </Box>
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
    </Box>
  );
}
