import { Link as RouterLink, NavLink, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { KeyIcon } from "./KeyIcon";

// קישור בתפריט: כשהוא פעיל מקבל class בשם active מ-NavLink, ומודגש בנחושת
const activeLinkSx = {
  borderRadius: 0,
  borderBottom: "2px solid transparent",
  "&.active": { color: "secondary.main", borderBottomColor: "secondary.main" },
};

export function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  function handleLogout() {
    logout();
    // מנקים את כל הנתונים השמורים, כדי שהמשתמשת הבאה לא תראה מה שראתה המנהלת (למשל חדרי טיוטה)
    queryClient.clear();
    navigate("/");
  }
  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        backdropFilter: "blur(8px)",
        bgcolor: "rgba(9, 9, 10, 0.86)",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Toolbar
        sx={{ gap: 2, flexWrap: "wrap", maxWidth: 1100, width: "100%", mx: "auto", minHeight: { md: 84 } }}
      >
        <Typography
          component={RouterLink}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            fontFamily: "var(--heading)",
            fontWeight: 700,
            fontSize: { xs: "1.25rem", md: "1.9rem" },
            letterSpacing: { xs: "0.18em", md: "0.24em" },
            color: "text.primary",
            textDecoration: "none",
          }}
        >
          <KeyIcon />
          ESCAPEZONE
        </Typography>
        <Button component={NavLink} to="/rooms" color="inherit" sx={activeLinkSx}>
          החדרים
        </Button>
        {user?.role === "admin" && (
          <Button component={NavLink} to="/admin" color="inherit" sx={activeLinkSx}>
            ניהול
          </Button>
        )}
        <Box
          sx={{ marginInlineStart: "auto", display: "flex", alignItems: "center", gap: 1 }}
        >
          {user ? (
            <>
              <Typography color="text.secondary">שלום, {user.name}</Typography>
              <Button variant="outlined" color="inherit" onClick={handleLogout}>
                התנתקות
              </Button>
            </>
          ) : (
            <>
              <Button component={NavLink} to="/login" color="inherit" sx={activeLinkSx}>
                התחברות
              </Button>
              <Button component={NavLink} to="/register" variant="contained">
                הרשמה
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
