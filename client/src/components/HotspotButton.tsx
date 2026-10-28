import { Box, ButtonBase } from "@mui/material";

type HotspotButtonProps = {
  label: string;
  number: number; // מספר הראיה (1, 2, 3...)
  x: number; // מיקום אופקי באחוזים מצד שמאל של התמונה
  y: number; // מיקום אנכי באחוזים מלמעלה
  solved: boolean;
  locked: boolean; // נעול עד שפותרים את החידה הקודמת
  onClick: () => void;
};

// תגית ראיה ממורכזת סביב הנקודה (x, y), ומוקטנת ביחס הפוך לזום כדי שלא תתנפח כשהמצלמה מתקרבת
export function HotspotButton({ label, number, x, y, solved, locked, onClick }: HotspotButtonProps) {
  return (
    <Box
      // המיקום והטרנספורם ב-style רגיל (ולא ב-sx), כי תוסף ה-RTL של MUI הופך שם ימין ושמאל
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%) scale(calc(1 / var(--zoom, 1)))",
      }}
      sx={{
        position: "absolute",
        zIndex: 2,
        transition: "transform 1.1s ease-in-out",
      }}
    >
      <ButtonBase
        onClick={onClick}
        disabled={locked}
        className={`hotspot${solved ? " hotspot-solved" : ""}${locked ? " hotspot-locked" : ""}`}
      >
        <span className="hotspot-num">{number}</span>
        <span className="hotspot-label">{locked ? "נעול" : label}</span>
      </ButtonBase>
    </Box>
  );
}
