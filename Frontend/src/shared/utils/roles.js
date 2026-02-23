// src/shared/utils/roles.js
/**
 * Rôles de l'application (multi-tenant ready).
 * learner : apprenant (marketplace classique)
 * tutor : tuteur indépendant
 * center_owner : propriétaire d'organisation = tutor + admin organisation
 */
export const ROLES = {
  Learner: "learner",
  Tutor: "tutor",
  CenterOwner: "center_owner",
  ADMIN: "ADMIN",
};
