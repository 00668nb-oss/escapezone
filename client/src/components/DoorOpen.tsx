import { Box, Typography } from "@mui/material";

// דלת שנפתחת ומאירה את המסך (האנימציה ב-index.css)
export function DoorOpen() {
  return (
    <Box className="door-scene">
      <Box className="door-light" />
      <Box className="door-panel door-left" />
      <Box className="door-panel door-right" />
      <Typography className="door-text">הדלת נפתחה!</Typography>
    </Box>
  );
}
