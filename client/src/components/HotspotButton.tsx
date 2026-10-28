import { Button } from "@mui/material";

type HotspotButtonProps = {
  label: string;
  position: number;
  solved: boolean;
  locked: boolean; // נעול עד שפותרים את החידה הקודמת
  onClick: () => void;
};
export function HotspotButton({
  label,
  position,
  solved,
  locked,
  onClick,
}: HotspotButtonProps) {
  return (
    <Button
      variant="contained"
      color={solved ? "success" : "secondary"}
      onClick={onClick}
      disabled={locked}
      className={`hotspot hotspot-${position}${locked ? " hotspot-locked" : ""}`}
      sx={{ position: "absolute", borderRadius: 999 }}
    >
      {locked ? (
        "🔒"
      ) : (
        <>
          {solved && "✓ "}
          {label}
        </>
      )}
    </Button>
  );
}
