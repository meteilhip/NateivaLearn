// src/shared/components/chat/ChatLayout.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ConversationList } from "./ConversationList";
import { ChatWindow } from "./ChatWindow";
import { useChatStore } from "../../../app/store/chat.store";
import { useAuthStore } from "../../../app/store/auth.store";

/**
 * ChatLayout
 * ----------
 * Layout principal du système de chat.
 * Affiche la liste des conversations et la fenêtre de chat.
 */
export const ChatLayout = () => {
  const { conversations, getMessages, sendMessage, markAsRead, setCurrentUserId, fetchConversations, fetchMessagesForConversation } = useChatStore();
  const user = useAuthStore((state) => state.user);
  const userId = user?.id || user?.email;
  const location = useLocation();
  const initialConversationId = location.state?.conversationId;

  useEffect(() => {
    setCurrentUserId(userId);
  }, [userId, setCurrentUserId]);

  useEffect(() => {
    if (userId) fetchConversations();
  }, [userId, fetchConversations]);

  const [selectedConversationId, setSelectedConversationId] = useState(null);

  // Sélection initiale (ex: depuis "Écrire à l'apprenant") dès que les conversations sont chargées
  useEffect(() => {
    if (!initialConversationId || selectedConversationId) return;
    const found = conversations.find((c) => String(c.id) === String(initialConversationId));
    if (found) setSelectedConversationId(found.id);
  }, [initialConversationId, conversations, selectedConversationId]);

  // Charger les messages et marquer comme lu quand on sélectionne une conversation
  useEffect(() => {
    if (selectedConversationId) {
      markAsRead(selectedConversationId);
      fetchMessagesForConversation(selectedConversationId);
    }
  }, [selectedConversationId, markAsRead, fetchMessagesForConversation]);

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId);
  const conversationMessages = selectedConversationId
    ? getMessages(selectedConversationId)
    : [];

  const handleSendMessage = (text) => {
    if (selectedConversationId) {
      sendMessage(selectedConversationId, text);
    }
  };

  return (
    <div className="flex h-[calc(80vh)] bg-white rounded-lg shadow-md overflow-hidden">
      {/* Liste des conversations */}
      <div className="w-1/3 min-w-[300px]">
        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onSelect={setSelectedConversationId}
        />
      </div>

      {/* Fenêtre de chat */}
      <div className="flex-1">
        <ChatWindow
          conversation={selectedConversation}
          messages={conversationMessages}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};