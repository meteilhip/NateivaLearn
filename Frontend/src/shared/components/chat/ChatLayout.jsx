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
  const { conversations, getMessages, sendMessage, markAsRead, setCurrentUserId, fetchConversations } = useChatStore();
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

  // Sélection initiale éventuelle (ex: depuis une réservation "Écrire un message")
  useEffect(() => {
    if (!selectedConversationId && initialConversationId && conversations.length > 0) {
      const exists = conversations.some((c) => String(c.id) === String(initialConversationId));
      if (exists) {
        setSelectedConversationId(initialConversationId);
      }
    }
  }, [initialConversationId, conversations, selectedConversationId]);

  // Marquer comme lu quand on sélectionne une conversation
  useEffect(() => {
    if (selectedConversationId) {
      markAsRead(selectedConversationId);
    }
  }, [selectedConversationId, markAsRead]);

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