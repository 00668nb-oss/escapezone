import { Link as RouterLink, NavLink, useNavigate } from "react-router-dom";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";

// קישור בתפריט: כשהוא פעיל מקבל class בשם active מ-NavLink, והצבע הופך לזהב
const activeLinkSx = { "&.active": { color: "secondary.main" } };

export function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }
  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        backdropFilter: "blur(10px)",
        bgcolor: "rgba(14, 10, 24, 0.78)",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Toolbar
        sx={{ gap: 2, flexWrap: "wrap", maxWidth: 1100, width: "100%", mx: "auto" }}
      >
        <Typography
          component={RouterLink}
          to="/"
          variant="h6"
          sx={{ fontWeight: 800, color: "text.primary", textDecoration: "none" }}
        >
          🔑 EscapeZone
        </Typography>
        <Button component={NavLink} to="/rooms" color="inherit" sx={activeLinkSx}>
          חדרים
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
