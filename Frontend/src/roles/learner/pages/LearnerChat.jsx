// src/roles/learner/pages/LearnerChat.jsx
import { useTranslation } from "react-i18next";
import { ChatLayout } from "../../../shared/components/chat/ChatLayout";

/**
 * LearnerChat - Section Messages côté apprenant.
 * Utilise le ChatLayout réutilisable.
 */
export const LearnerChat = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/**<h1 className="text-2xl font-bold text-dark">{t("chat.title")}</h1>**/}
      <ChatLayout />
    </div>
  );
};
