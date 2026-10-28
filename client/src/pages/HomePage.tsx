import { Link } from "react-router-dom";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useRooms } from "../hooks/useRooms";
import { RoomCard } from "../components/RoomCard";
import { EchoMessage } from "../components/EchoMessage";

const steps = [
  { icon: "🗝️", title: "בחרו חדר", text: "בחרו תעלומה לפי רמת קושי וקטגוריה." },
  { icon: "🔍", title: "מצאו וחקרו", text: "לחצו על החפצים בתמונה ופתרו את החידה של כל אחד." },
  { icon: "🚪", title: "ברחו", text: "כל חידה חושפת קטע סיפור. פתרו את כולן וגלו מה קרה." },
];

const highlights = ["⏱ 15 דקות בלבד", "🧩 חידות עם רמזים", "📖 סיפור שמתגלה", "🎉 סוף מפתיע"];

export function HomePage() {
  const { user } = useAuth();
  const { data: rooms } = useRooms();

  return (
    <Box sx={{ display: "grid", gap: 7 }}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 4,
          border: 1,
          borderColor: "divider",
          textAlign: "center",
          px: 3,
          py: { xs: 5, md: 8 },
          backgroundImage:
            "linear-gradient(rgba(14, 10, 24, 0.5), rgba(14, 10, 24, 0.94)), url(/images/zero-office.svg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Typography component="span" className="float" sx={{ fontSize: "3rem" }}>
          🔑
        </Typography>
        <Typography
          variant="h2"
          component="h1"
          className="title-glow"
          sx={{ fontWeight: 800, mb: 2, fontSize: { xs: "2.2rem", md: "3.6rem" } }}
        >
          הדלת נעולה. הסיפור מחכה.
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: "38rem", mx: "auto", mb: 3 }}>
          חדרי בריחה דיגיטליים: מצאו חפצים, פתרו חידות וגלו מה באמת קרה.
        </Typography>
        <Box sx={{ maxWidth: "36rem", mx: "auto", mb: 4, textAlign: "start" }}>
          <EchoMessage text="זוהתה כניסה חדשה. הדלת ננעלה מאחוריכם. יש לכם 15 דקות." />
        </Box>
        <Stack direction="row" spacing={2} useFlexGap sx={{ justifyContent: "center", flexWrap: "wrap" }}>
          {user ? (
            <Button component={Link} to="/rooms" variant="contained" size="large" sx={{ px: 5, py: 1.4, fontSize: "1.15rem" }}>
              להיכנס לחדרים
            </Button>
          ) : (
            <>
              <Button component={Link} to="/register" variant="contained" size="large" sx={{ px: 5, py: 1.4, fontSize: "1.15rem" }}>
                הרשמה והתחלה
              </Button>
              <Button component={Link} to="/login" variant="outlined" color="secondary" size="large" sx={{ px: 4, py: 1.4 }}>
                יש לי כבר חשבון
              </Button>
            </>
          )}
        </Stack>
        <Stack direction="row" spacing={1} useFlexGap sx={{ justifyContent: "center", flexWrap: "wrap", mt: 4 }}>
          {highlights.map((text) => (
            <Chip key={text} label={text} variant="outlined" sx={{ bgcolor: "rgba(14, 10, 24, 0.6)" }} />
          ))}
        </Stack>
      </Box>

      {rooms && rooms.length > 0 && (
        <Box>
          <Typography variant="h4" component="h2" sx={{ textAlign: "center", mb: 3 }}>
            בחרו תעלומה
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(17rem, 1fr))",
              gap: 3,
            }}
          >
            {rooms.slice(0, 3).map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </Box>
        </Box>
      )}

      <Box>
        <Typography variant="h4" component="h2" sx={{ textAlign: "center", mb: 3 }}>
          איך זה עובד?
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(13rem, 1fr))",
            gap: 3,
          }}
        >
          {steps.map((step, index) => (
            <Paper key={step.title} sx={{ p: 3, textAlign: "center", position: "relative" }}>
              <Typography sx={{ fontSize: "2.6rem", lineHeight: 1.2 }}>{step.icon}</Typography>
              <Typography
                sx={{
                  position: "absolute",
                  top: 12,
                  insetInlineStart: 12,
                  width: 30,
                  height: 30,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "50%",
                  bgcolor: "secondary.main",
                  color: "#1a1203",
                  fontWeight: 800,
                }}
              >
                {index + 1}
              </Typography>
              <Typography variant="h6" component="h3" gutterBottom>
                {step.title}
              </Typography>
              <Typography color="text.secondary">{step.text}</Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      {!user && (
        <Paper sx={{ p: 4, textAlign: "center", borderColor: "secondary.main", border: 1 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            מוכנים להיכנס?
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            ההרשמה לוקחת חצי דקה, והשעון מתחיל לרוץ רק כשנכנסים לחדר.
          </Typography>
          <Button component={Link} to="/register" variant="contained" color="secondary">
            בואו נתחיל
          </Button>
        </Paper>
      )}
    </Box>
  );
}
