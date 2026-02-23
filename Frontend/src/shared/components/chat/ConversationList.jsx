// src/shared/components/chat/ConversationList.jsx
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaCircle } from "react-icons/fa";

/**
 * ConversationList
 * ----------------
 * Liste des conversations dans le chat.
 * Affiche les conversations avec le dernier message et le statut de lecture.
 */
export const ConversationList = ({ conversations, selectedConversationId, onSelect }) => {
  const { t } = useTranslation();

  return (
    <div className="border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-dark">
          {t("chat.conversations", "Conversations")}
        </h2>
      </div>

      <div className="divide-y divide-gray-200">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            {t("chat.noConversations", "Aucune conversation")}
          </div>
        ) : (
          conversations.map((conversation) => {
            const isSelected = conversation.id === selectedConversationId;
            const lastMessage = conversation.lastMessage;
            const hasUnread = conversation.unreadCount > 0;

            return (
              <motion.div
                key={conversation.id}
                onClick={() => onSelect(conversation.id)}
                className={`
                  p-4 cursor-pointer transition
                  ${isSelected ? "bg-primary/10 border-l-4 border-primary" : "hover:bg-gray-50"}
                `}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={conversation.avatar || "/placeholder-avatar.png"}
                      alt={conversation.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-dark">{conversation.name}</h3>
                      {conversation.isOnline && (
                        <span className="text-xs text-emerald-600 flex items-center gap-1">
                          <FaCircle size={6} /> {t("chat.online", "En ligne")}
                        </span>
                      )}
                    </div>
                  </div>
                  {hasUnread && (
                    <span className="bg-red-500 text-white text-xs font-semibold rounded-full px-2.5 py-1 min-w-[24px] text-center flex items-center justify-center">
                      {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
                    </span>
                  )}
                </div>

                {lastMessage && (
                  <p className="text-sm text-gray-600 truncate ml-12">
                    {lastMessage.text}
                  </p>
                )}

                {lastMessage && (
                  <p className="text-xs text-gray-400 ml-12 mt-1">
                    {new Date(lastMessage.timestamp).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
