// src/roles/tutor/pages/TutorChat.jsx
import { useTranslation } from "react-i18next";
import { ChatLayout } from "../../../shared/components/chat/ChatLayout";

/**
 * TutorChat - Section Messages côté tuteur.
 * Utilise le ChatLayout réutilisable.
 */
export const TutorChat = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/**<h1 className="text-2xl font-bold text-dark">{t("chat.title")}</h1>**/}
      <ChatLayout />
    </div>
  );
};
