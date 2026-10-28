import { Box } from "@mui/material";

type StampProps = {
  text: string;
};

// חותמת אדומה שנחבטת על המסך (האנימציה ב-index.css)
export function Stamp({ text }: StampProps) {
  return <Box className="stamp-big">{text}</Box>;
}
