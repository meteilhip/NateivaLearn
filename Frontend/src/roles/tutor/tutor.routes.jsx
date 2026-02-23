import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../../app/router/ProtectedRoute";
import { ROLES } from "../../shared/utils/roles";
import { AppLayout } from "../../app/layouts/AppLayout";
import { tutorMenu, tutorActions } from "./tutor.menu";
import { TutorDashboard } from "./pages/TutorDashboard";
import { TutorProfile } from "./pages/TutorProfile";
import { AvailabilityManager } from "./pages/AvailabilityManager";
import { TutorBookings } from "./pages/TutorBookings";
import { TutorCalendar } from "./pages/TutorCalendar";
import { TutorVideo } from "./pages/TutorVideo";
import { TutorSettings } from "./pages/TutorSettings";
import { TutorChat } from "./pages/TutorChat";
import { TutorCenter } from "./pages/TutorCenter";

export const TutorRoutes = () => (
  <Routes>
    <Route
      element={
        <ProtectedRoute allowedRoles={[ROLES.Tutor, ROLES.CenterOwner]}>
          <AppLayout menu={tutorMenu} actions={tutorActions} />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<TutorDashboard />} />
      <Route path="profile" element={<TutorProfile />} />
      <Route path="availability" element={<AvailabilityManager />} />
      <Route path="courses" element={<TutorBookings />} />
      <Route path="chat" element={<TutorChat />} />
      <Route path="center" element={<TutorCenter />} />
      <Route path="calendar" element={<TutorCalendar />} />
      <Route path="video" element={<TutorVideo />} />
      <Route path="settings" element={<TutorSettings />} />
    </Route>
  </Routes>
);
