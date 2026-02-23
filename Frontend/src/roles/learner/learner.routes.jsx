import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../../app/router/ProtectedRoute";
import { ROLES } from "../../shared/utils/roles";
import { AppLayout } from "../../app/layouts/AppLayout";
import { learnerMenu, learnerActions } from "./learner.menu";

import { LearnerDashboard } from "./pages/LearnerDashboard";
import { LearnerCourses } from "./pages/LearnerCourses";
import { LearnerChat } from "./pages/LearnerChat";
import { LearnerCalendar } from "./pages/LearnerCalendar";
import { LearnerVideo } from "./pages/LearnerVideo";
import { LearnerSettings } from "./pages/LearnerSettings";
import { LearnerProfile } from "./pages/LearnerProfile";
import { BookingPage } from "./pages/BookingPage";
import { LearnerCenter } from "./pages/LearnerCenter";
import { LearnerQuiz } from "./pages/LearnerQuiz";

export const LearnerRoutes = () => (
  <Routes>
    <Route
      element={
        <ProtectedRoute allowedRoles={[ROLES.Learner]}>
          <AppLayout menu={learnerMenu} actions={learnerActions} />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<LearnerDashboard />} />
      <Route path="courses" element={<LearnerCourses />} />
      <Route path="booking/:tutorId" element={<BookingPage />} />
      <Route path="center" element={<LearnerCenter />} />
      <Route path="quiz" element={<LearnerQuiz />} />
      <Route path="chat" element={<LearnerChat />} />
      <Route path="calendar" element={<LearnerCalendar />} />
      <Route path="video" element={<LearnerVideo />} />
      <Route path="settings" element={<LearnerSettings />} />
      <Route path="profile" element={<LearnerProfile />} />
    </Route>
  </Routes>
);
