/**
 * CenterOwnerTutorsManagement
 * ----------------------------
 * 👑 Gestion des tuteurs de l'organisation (mock).
 * Utilise TutorManagementList pour gérer les demandes et membres.
 * 🔌 Backend : liste membres role=tutor, invite, revoke.
 */
import { useTranslation } from "react-i18next";
import { TutorManagementList } from "../components/TutorManagementList";

export function CenterOwnerTutorsManagement() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-dark">{t("center_owner.manageTutorsTitle")}</h1>
      <p className="text-dark/60 text-sm">{t("center_owner.manageTutorsSubtitle")}</p>
      <TutorManagementList />
    </div>
  );
}
