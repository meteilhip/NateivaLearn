// src/roles/center_owner/pages/CenterOwnerChat.jsx
import { useTranslation } from "react-i18next";
import { ChatLayout } from "../../../shared/components/chat/ChatLayout";

/**
 * CenterOwnerChat - Section Messages côté propriétaire.
 * Peut écrire avec tutor et learner.
 * Utilise le ChatLayout réutilisable.
 */
export const CenterOwnerChat = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/**<h1 className="text-2xl font-bold text-dark">{t("chat.title")}</h1>**/}
      <ChatLayout />
    </div>
  );
};
