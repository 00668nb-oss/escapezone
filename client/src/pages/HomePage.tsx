import { Link } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useRooms } from "../hooks/useRooms";
import { RoomCard } from "../components/RoomCard";
import { EchoMessage } from "../components/EchoMessage";

const steps = [
  { title: "בחרו תיק", text: "בחרו תעלומה לפי רמת קושי וקטגוריה." },
  { title: "חקרו את הזירה", text: "לחצו על תגיות הראיה בתמונה ופתרו את החידה של כל אחת." },
  { title: "סגרו את התיק", text: "כל חידה חושפת קטע מהסיפור. פתרו את כולן וגלו מה קרה." },
];

export function HomePage() {
  const { user } = useAuth();
  const { data: rooms } = useRooms();

  return (
    <Box sx={{ display: "grid", gap: 10 }}>
      <Box
        className="hero-full"
        style={{
          backgroundImage:
            "linear-gradient(270deg, rgba(9, 9, 10, 0.88), rgba(9, 9, 10, 0.25) 65%, rgba(9, 9, 10, 0.5)), linear-gradient(0deg, #09090a, transparent 35%), url(/images/zero-office.jpg)",
        }}
      >
        <Box className="hero-inner">
          <Typography className="kicker" sx={{ mb: 2 }}>
            חדרי בריחה דיגיטליים · 15 דקות
          </Typography>
          <Typography
            variant="h1"
            sx={{ fontSize: { xs: "3rem", md: "5.6rem" }, lineHeight: 1.02, mb: 3 }}
          >
            הדלת נעולה.
            <br />
            הסיפור מחכה.
          </Typography>
          <Typography sx={{ fontSize: "1.2rem", maxWidth: "32rem", mb: 3.5, color: "text.secondary" }}>
            אספו ראיות, פתרו חידות וגלו מה באמת קרה, לפני שהזמן נגמר.
          </Typography>
          <Box sx={{ maxWidth: "32rem", mb: 4 }}>
            <EchoMessage text="זוהתה כניסה חדשה. הדלת ננעלה מאחוריכם. יש לכם 15 דקות." />
          </Box>
          <Stack direction="row" spacing={3} useFlexGap sx={{ flexWrap: "wrap", alignItems: "center" }}>
            {user ? (
              <Button component={Link} to="/rooms" variant="contained" size="large" sx={{ px: 5, py: 1.3 }}>
                לתיקים
              </Button>
            ) : (
              <>
                <Button component={Link} to="/register" variant="contained" size="large" sx={{ px: 5, py: 1.3 }}>
                  הרשמה והתחלה
                </Button>
                <Button component={Link} to="/login" color="inherit" sx={{ textDecoration: "underline", textUnderlineOffset: 6 }}>
                  יש לי כבר חשבון
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Box>

      {rooms && rooms.length > 0 && (
        <Box>
          <Typography className="kicker" sx={{ mb: 1 }}>
            ארכיון
          </Typography>
          <Typography variant="h3" component="h2" sx={{ mb: 4 }}>
            התיקים הפתוחים
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(17rem, 1fr))",
              gap: 5,
            }}
          >
            {rooms.slice(0, 3).map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </Box>
        </Box>
      )}

      <Box>
        <Typography className="kicker" sx={{ mb: 1 }}>
          נוהל עבודה
        </Typography>
        <Typography variant="h3" component="h2" sx={{ mb: 4 }}>
          איך זה עובד
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))",
            gap: 5,
          }}
        >
          {steps.map((step, index) => (
            <Box key={step.title} sx={{ borderTop: 1, borderColor: "divider", pt: 2.5 }}>
              <Typography
                sx={{
                  fontFamily: "var(--heading)",
                  fontWeight: 500,
                  fontSize: "3.2rem",
                  lineHeight: 1,
                  color: "#9b2226",
                  mb: 1.5,
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </Typography>
              <Typography variant="h5" component="h3" gutterBottom>
                {step.title}
              </Typography>
              <Typography color="text.secondary">{step.text}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {!user && (
        <Box sx={{ borderTop: 1, borderBottom: 1, borderColor: "divider", py: 7, textAlign: "center" }}>
          <Typography variant="h3" component="h2" gutterBottom>
            מוכנים לפתוח את התיק?
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            ההרשמה לוקחת חצי דקה, והשעון מתחיל לרוץ רק כשנכנסים לחדר.
          </Typography>
          <Button component={Link} to="/register" variant="contained" size="large" sx={{ px: 5 }}>
            מתחילים
          </Button>
        </Box>
      )}
    </Box>
  );
}
