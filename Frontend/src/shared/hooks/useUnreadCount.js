// src/shared/hooks/useUnreadCount.js
import { useMemo } from "react";
import { useChatStore } from "../../app/store/chat.store";

/**
 * useUnreadCount
 * --------------
 * Hook pour obtenir le nombre de messages non lus.
 * Utilisé pour afficher le badge de notification.
 */
export const useUnreadCount = () => {
  const { conversations } = useChatStore();

  const unreadCount = useMemo(() => {
    return conversations.reduce((total, conv) => total + (conv.unreadCount || 0), 0);
  }, [conversations]);

  return unreadCount;
};
