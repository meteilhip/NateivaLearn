/**
 * CenterOwnerLearnersManagement
 * -------------------------------
 * 👑 Gestion des apprenants de l'organisation (mock).
 * Utilise LearnerManagementList pour gérer les demandes et membres.
 * 🔌 Backend : liste memberships role=learner.
 */
import { useTranslation } from "react-i18next";
import { LearnerManagementList } from "../components/LearnerManagementList";

export function CenterOwnerLearnersManagement() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-dark">{t("center_owner.manageLearnersTitle")}</h1>
      <p className="text-dark/60 text-sm">{t("center_owner.manageLearnersSubtitle")}</p>
      <LearnerManagementList />
    </div>
  );
}
