import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../../app/router/ProtectedRoute";
import { ROLES } from "../../shared/utils/roles";
import { AppLayout } from "../../app/layouts/AppLayout";
import { centerOwnerMenu, centerOwnerActions } from "./center_owner.menu";
import { CenterOwnerOverview } from "./pages/CenterOwnerOverview";
import { CenterOwnerCenter } from "./pages/CenterOwnerCenter";
import { CenterOwnerSettings } from "./pages/CenterOwnerSettings";
import { CenterOwnerProfile } from "./pages/CenterOwnerProfile";
import { CenterOwnerChat } from "./pages/CenterOwnerChat";
import { CenterAgendaView } from "./pages/CenterAgendaView";
import { VideoCallLayout } from "./pages/VideoCallLayout";
import { TutorBookings } from "../tutor/pages/TutorBookings";
import { AvailabilityManager } from "../tutor/pages/AvailabilityManager";

/**
 * Routes center_owner.
 * center_owner a les capacités Tutor : on réutilise TeacherBookings pour /courses.
 */
export const CenterOwnerRoutes = () => (
  <Routes>
    <Route
      element={
        <ProtectedRoute allowedRoles={[ROLES.CenterOwner]}>
          <AppLayout menu={centerOwnerMenu} actions={centerOwnerActions} />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<CenterOwnerOverview />} />
      <Route path="availability" element={<AvailabilityManager />} />
      <Route path="center" element={<CenterOwnerCenter />} />
      <Route path="chat" element={<CenterOwnerChat />} />
      <Route path="agenda" element={<CenterAgendaView />} />
      <Route path="video" element={<VideoCallLayout />} />
      <Route path="settings" element={<CenterOwnerSettings />} />
      <Route path="profile" element={<CenterOwnerProfile />} />
      <Route path="courses" element={<TutorBookings />} />
    </Route>
  </Routes>
);
