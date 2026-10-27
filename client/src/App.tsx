import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { NotFoundPage } from "./pages/NotFoundPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { RoomPage } from "./pages/RoomPage";
import { FinishPage } from "./pages/FinishPage";
import { AdminRoomsPage } from "./pages/AdminRoomsPage";
import { RoomFormPage } from "./pages/RoomFormPage";
import { AdminPuzzlesPage } from "./pages/AdminPuzzlesPage";
import { RoomsPage } from "./pages/RoomsPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="rooms/:id" element={<RoomPage />} />
          <Route path="rooms/:id/finish" element={<FinishPage />} />
        </Route>
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="admin" element={<AdminRoomsPage />} />
          <Route path="admin/rooms/new" element={<RoomFormPage />} />
          <Route path="admin/rooms/:id/edit" element={<RoomFormPage />} />
          <Route
            path="admin/rooms/:id/puzzles"
            element={<AdminPuzzlesPage />}
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
