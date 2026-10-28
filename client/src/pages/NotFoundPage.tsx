import { Link } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

export function NotFoundPage() {
  return (
    <Box sx={{ textAlign: "center", py: 8 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        404
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        הדלת הזאת לא קיימת. אולי טעיתם בכתובת?
      </Typography>
      <Button component={Link} to="/" variant="contained">
        חזרה לדף הבית
      </Button>
    </Box>
  );
}
