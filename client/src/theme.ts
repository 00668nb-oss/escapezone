import { createTheme } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";

// סגנון קולנועי: שחור עמוק, טקסט בצבע נייר, תמונות גדולות, וכמעט בלי מסגרות.
// נגיעות של "תיק חקירה": כותרות סריפיות, אדום יין לחותמות, ונייר מיושן בחלון החידה.
const headingFont = '"Frank Ruhl Libre", "David Libre", Georgia, serif';
const bodyFont = '"Assistant", "Heebo", system-ui, "Segoe UI", Arial, sans-serif';

const grain =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .035 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

function buildTheme(mode: PaletteMode) {
  const dark = mode === "dark";
  return createTheme({
    direction: "rtl",
    palette: {
      mode,
      // באתר הכהה הכפתור הראשי בצבע נייר; על הנייר (חלון החידה) הוא אדום יין
      primary: dark
        ? { main: "#e9e6df", contrastText: "#0a0a0b" }
        : { main: "#9b2226", contrastText: "#f1ead9" },
      secondary: { main: dark ? "#d6d1c4" : "#7a5c2e" },
      success: { main: dark ? "#6fae7a" : "#3e7a4a" },
      error: { main: "#c0392b" },
      background: dark
        ? { default: "#09090a", paper: "#111113" }
        : { default: "#e6dcc4", paper: "#e6dcc4" },
      text: dark
        ? { primary: "#ece9e2", secondary: "#a9a59b" }
        : { primary: "#1f1b16", secondary: "#5a5043" },
      divider: dark ? "#2a2a2d" : "#b9ab8c",
    },
    shape: { borderRadius: 2 },
    typography: {
      fontFamily: bodyFont,
      h1: { fontFamily: headingFont, fontWeight: 500 },
      h2: { fontFamily: headingFont, fontWeight: 500 },
      h3: { fontFamily: headingFont, fontWeight: 500 },
      h4: { fontFamily: headingFont, fontWeight: 700 },
      h5: { fontFamily: headingFont, fontWeight: 700 },
      h6: { fontFamily: headingFont, fontWeight: 700 },
      button: { textTransform: "none", fontWeight: 700, letterSpacing: "0.03em" },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            minHeight: "100svh",
            backgroundColor: "#09090a",
            backgroundImage: grain,
            backgroundAttachment: "fixed",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundImage: "none",
            border: `1px solid ${theme.palette.divider}`,
          }),
        },
      },
      MuiAppBar: { styleOverrides: { root: { border: 0 } } },
      MuiButton: { defaultProps: { disableElevation: true } },
      MuiTextField: { defaultProps: { fullWidth: true, size: "small" } },
      MuiChip: { styleOverrides: { root: { borderRadius: 2, fontWeight: 600 } } },
      MuiAlert: { styleOverrides: { root: { borderRadius: 2 } } },
      MuiLinearProgress: { styleOverrides: { root: { height: 2, borderRadius: 0 } } },
      MuiDialog: {
        styleOverrides: { paper: { boxShadow: "0 24px 70px rgba(0, 0, 0, 0.7)" } },
      },
    },
  });
}

export const theme = buildTheme("dark");
// ערכת נייר מיושן, לחלון החידה
export const paperTheme = buildTheme("light");
