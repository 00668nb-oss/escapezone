import { useState } from "react";
import type { CSSProperties, ReactNode, SyntheticEvent } from "react";
import { Box } from "@mui/material";

type RoomSceneProps = {
  imageUrl: string;
  alt: string;
  brightness: number; // 0-1: החדר מתבהר ככל שפותרים יותר חידות
  flickerKey: number; // כשהמספר משתנה, האור מהבהב
  focusX: number; // נקודת המיקוד של המצלמה (אחוזים)
  focusY: number;
  zoom: number; // 1 = בלי זום
  children: ReactNode; // החפצים (זזים וגדלים יחד עם התמונה)
  overlay?: ReactNode; // שכבה קבועה מעל הסצנה (שעון, הודעות), לא מושפעת מהזום
};

// הסצנה ממלאת את כל רוחב ואת כל גובה המסך (התמונה "מכסה" אותה, כמו background-size: cover),
// כדי להרגיש שנמצאים בחדר. שכבה אחת נעה לאט כל הזמן, ושכבה פנימית מתקרבת לנקודת המיקוד.
// הגודל והמיקום של הבמה (.scene-stage) מוגדרים ב-index.css לפי יחס התמונה (--aspect).
export function RoomScene({
  imageUrl,
  alt,
  brightness,
  flickerKey,
  focusX,
  focusY,
  zoom,
  children,
  overlay,
}: RoomSceneProps) {
  // יחס התמונה נקרא מהתמונה עצמה, כך שכל תמונה (לא רק 16:9) מוצגת נכון
  const [aspect, setAspect] = useState(4 / 3);

  const viewportStyle = { "--bg": `url(${imageUrl})` } as CSSProperties;
  const stageStyle = { "--aspect": aspect, aspectRatio: `${aspect}` } as CSSProperties;
  const zoomStyle = {
    transform: `scale(${zoom})`,
    transformOrigin: `${focusX}% ${focusY}%`,
    "--zoom": zoom,
  } as CSSProperties;

  return (
    <Box className="scene-viewport" style={viewportStyle}>
      <Box className="scene-stage" style={stageStyle}>
        <Box className="camera-drift" sx={{ position: "absolute", inset: 0 }}>
          <Box
            style={zoomStyle}
            sx={{
              position: "absolute",
              inset: 0,
              transition: "transform 1.1s ease-in-out, transform-origin 1.1s ease-in-out",
            }}
          >
            <Box
              key={flickerKey}
              component="img"
              src={imageUrl}
              alt={alt}
              className="flicker"
              onLoad={(event: SyntheticEvent<HTMLImageElement>) =>
                setAspect(event.currentTarget.naturalWidth / event.currentTarget.naturalHeight)
              }
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                filter: `brightness(${brightness})`,
                transition: "filter 1.2s",
              }}
            />
            {children}
          </Box>
        </Box>
      </Box>
      {overlay}
    </Box>
  );
}
