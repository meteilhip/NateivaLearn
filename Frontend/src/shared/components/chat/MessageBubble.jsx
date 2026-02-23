// src/shared/components/chat/MessageBubble.jsx
import { useAuthStore } from "../../../app/store/auth.store";
import { motion } from "framer-motion";

/**
 * MessageBubble
 * --------------
 * Bulle de message dans le chat.
 * Affiche différemment selon si c'est l'utilisateur courant ou l'interlocuteur.
 */
export const MessageBubble = ({ message }) => {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id || user?.email;
  // Les messages envoyés ont senderId === "current-user" dans le store
  const isOwnMessage = message.senderId === "current-user" || message.senderId === userId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-3`}
    >
      <div
        className={`
          max-w-[70%] rounded-lg px-4 py-2
          ${isOwnMessage
            ? "bg-red-500 text-white"
            : "bg-gray-100 text-dark"
          }
        `}
      >
        <p className="text-sm">{message.text}</p>
        <p
          className={`
            text-xs mt-1
            ${isOwnMessage ? "text-white/70" : "text-gray-500"}
          `}
        >
          {new Date(message.timestamp).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </motion.div>
  );
};
