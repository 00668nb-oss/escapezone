import { createTheme } from "@mui/material/styles";

// ערכת הנושא של MUI: כהה ומסתורית, בכיוון ימין לשמאל
export const theme = createTheme({
  direction: "rtl",
  palette: {
    mode: "dark",
    primary: { main: "#8b5cf6" },
    secondary: { main: "#f5c26b" },
    success: { main: "#34d399" },
    error: { main: "#f87171" },
    background: { default: "#0e0a18", paper: "#171126" },
    text: { primary: "#ffffff", secondary: "#cfc8e0" },
    divider: "#2e2548",
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Heebo", system-ui, "Segoe UI", Arial, sans-serif',
    button: { fontWeight: 700, textTransform: "none" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: "100svh",
          background:
            "radial-gradient(900px 500px at 85% -10%, rgba(139, 92, 246, 0.22), transparent 60%), radial-gradient(700px 420px at 0% 10%, rgba(245, 194, 107, 0.1), transparent 60%), #0e0a18",
          backgroundAttachment: "fixed",
        },
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiTextField: { defaultProps: { fullWidth: true, size: "small" } },
  },
});
