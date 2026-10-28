import { useEffect } from "react";
import { Outlet, useLocation, useMatch } from "react-router-dom";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";

export function Layout() {
  // בדף החדר התמונה ממלאת את כל גובה המסך, ולכן שם אין תחתית
  const isRoomPage = useMatch("/rooms/:id");
  const { pathname } = useLocation();

  // מעבר בין עמודים (גם דרך התחתית) מתחיל תמיד מראש העמוד
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <NavBar />
      <main className="main">
        <Outlet />
      </main>
      {!isRoomPage && <Footer />}
    </>
  );
}
