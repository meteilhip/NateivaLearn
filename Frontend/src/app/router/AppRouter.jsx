import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import AuthLayout from "../../auth/layouts/AuthLayout";
import Login from "../../auth/pages/Login";
import SignupMultiStep from "../../auth/pages/SignupMultiStep";
import { LearnerRoutes } from "../../roles/learner/learner.routes";
import { TutorRoutes } from "../../roles/tutor/tutor.routes";
import { CenterOwnerRoutes } from "../../roles/center_owner/center_owner.routes";
import { useAuthStore } from "../store/auth.store";

/**
 * AppRouter - Multi-tenant : learner, tutor, center_owner.
 */
export const AppRouter = () => {
  const fetchUser = useAuthStore((s) => s.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignupMultiStep />} />
    </Route>
    <Route path="/learner/*" element={<LearnerRoutes />} />
    <Route path="/tutor/*" element={<TutorRoutes />} />
    <Route path="/center_owner/*" element={<CenterOwnerRoutes />} />
  </Routes>
  );
};
