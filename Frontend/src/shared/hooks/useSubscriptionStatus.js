// src/shared/hooks/useSubscriptionStatus.js
import { useMemo } from "react";
import { useAuthStore } from "../../app/store/auth.store";

/**
 * useSubscriptionStatus
 * ----------------------
 * Hook pour simuler le statut d'abonnement d'un learner avec un tutor.
 * Frontend simulé : retourne des données mockées.
 * 
 * @param {string} tutorId - ID du tutor
 * @returns {object} { hasActiveSubscription, remainingHours, totalHours }
 */
export const useSubscriptionStatus = (tutorId) => {
  const user = useAuthStore((state) => state.user);
  const learnerId = user?.id || user?.email || "learner-1";

  // Simulation : certains learners ont des abonnements actifs
  const subscription = useMemo(() => {
    // Mock : simuler des abonnements actifs pour certains tutorId
    const mockSubscriptions = {
      "t1": { hasActiveSubscription: true, remainingHours: 3, totalHours: 10 },
      "t2": { hasActiveSubscription: false, remainingHours: 0, totalHours: 0 },
      "t3": { hasActiveSubscription: true, remainingHours: 5, totalHours: 8 },
    };

    return mockSubscriptions[tutorId] || {
      hasActiveSubscription: false,
      remainingHours: 0,
      totalHours: 0,
    };
  }, [tutorId, learnerId]);

  return subscription;
};
