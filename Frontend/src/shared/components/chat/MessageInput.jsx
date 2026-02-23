// src/shared/components/chat/MessageInput.jsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPaperPlane } from "react-icons/fa";

/**
 * MessageInput
 * ------------
 * Zone de saisie pour envoyer un message dans le chat.
 */
export const MessageInput = ({ onSend, disabled }) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("chat.typeMessage", "Écrivez votre message...")}
          disabled={disabled}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className={`
            px-4 py-2 rounded-lg transition
            ${disabled || !message.trim()
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary/90"
            }
          `}
        >
          <FaPaperPlane />
        </button>
      </div>
    </form>
  );
};
