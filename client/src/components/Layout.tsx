import { Outlet, useMatch } from "react-router-dom";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";

export function Layout() {
  // בדף החדר התמונה ממלאת את כל גובה המסך, ולכן שם אין תחתית
  const isRoomPage = useMatch("/rooms/:id");
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
