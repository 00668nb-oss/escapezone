import { Link as RouterLink } from "react-router-dom";
import { Box, Link, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { KeyIcon } from "./KeyIcon";

const linkSx = { color: "text.secondary", textDecoration: "none", "&:hover": { color: "text.primary" } };

// תחתית האתר: שם, משפט קצר, קישורים וזכויות יוצרים
export function Footer() {
  const { user } = useAuth();

  return (
    <Box
      component="footer"
      sx={{ borderTop: 1, borderColor: "divider", mt: 6, px: 3, py: 4 }}
    >
      <Box sx={{ display: "grid", justifyItems: "center", textAlign: "center", gap: 2.5 }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.2, mb: 1 }}>
            <KeyIcon />
            <Typography
              sx={{ fontFamily: "var(--heading)", fontWeight: 700, letterSpacing: "0.22em" }}
            >
              ESCAPEZONE
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            חדרי בריחה דיגיטליים. אספו ראיות, פתרו חידות וגלו מה באמת קרה.
          </Typography>
        </Box>
        <Box component="nav" aria-label="קישורים בתחתית" sx={{ display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "center" }}>
          <Link component={RouterLink} to="/" sx={linkSx}>
            דף הבית
          </Link>
          <Link component={RouterLink} to="/rooms" sx={linkSx}>
            החדרים
          </Link>
          {user?.role === "admin" && (
            <Link component={RouterLink} to="/admin" sx={linkSx}>
              ניהול
            </Link>
          )}
          {!user && (
            <>
              <Link component={RouterLink} to="/login" sx={linkSx}>
                התחברות
              </Link>
              <Link component={RouterLink} to="/register" sx={linkSx}>
                הרשמה
              </Link>
            </>
          )}
        </Box>
      </Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", textAlign: "center", mt: 3, opacity: 0.7 }}
      >
        © {new Date().getFullYear()} EscapeZone. כל הזכויות שמורות.
      </Typography>
    </Box>
  );
}
