// src/shared/components/chat/ChatWindow.jsx
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";

/**
 * ChatWindow
 * ----------
 * Fenêtre de chat principale.
 * Affiche les messages et permet d'envoyer de nouveaux messages.
 */
export const ChatWindow = ({ conversation, messages, onSendMessage }) => {
  const { t } = useTranslation();
  const messagesEndRef = useRef(null);

  // Scroll automatique vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <p className="text-gray-500">{t("chat.noConversation", "Sélectionnez une conversation")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* En-tête */}
      <div className="border-b border-gray-200 p-4 bg-white">
        <div className="flex items-center gap-3">
          <img
            src={conversation.avatar || "/placeholder-avatar.png"}
            alt={conversation.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-medium text-dark">{conversation.name}</h3>
            {conversation.isOnline && (
              <p className="text-xs text-emerald-600">{t("chat.online", "En ligne")}</p>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>{t("chat.noMessages", "Aucun message. Commencez la conversation !")}</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <MessageInput onSend={onSendMessage} />
    </div>
  );
};
