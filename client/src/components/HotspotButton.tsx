type HotspotButtonProps = {
  label: string;
  position: number;
  solved: boolean;
  onClick: () => void;
};
export function HotspotButton({
  label,
  position,
  solved,
  onClick,
}: HotspotButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`hotspot hotspot-${position} ${solved ? "hotspot-solved" : ""}`}
    >
      {solved && "✓ "}
      {label}
    </button>
  );
}
