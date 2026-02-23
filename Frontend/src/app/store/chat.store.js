// src/app/store/chat.store.js
import { create } from "zustand";

/**
 * Chat Store (mock)
 * -----------------
 * Simule : conversations, messages, badge unread, statut online.
 * Préparé pour futur WebSocket (remplacer addMessage par émission socket).
 */

const MOCK_CONVERSATIONS = [
  {
    id: "c1",
    participant: {
      id: "t1",
      name: "Marie Dupont",
      avatar: "/teacher-new.png",
      role: "teacher",
    },
    lastMessage: {
      text: "Parfait, à jeudi 10h pour le cours de maths !",
      sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      fromMe: false,
    },
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: "c2",
    participant: {
      id: "t2",
      name: "Jean Martin",
      avatar: "/teacher-new.png",
      role: "teacher",
    },
    lastMessage: {
      text: "Merci pour votre message.",
      sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      fromMe: true,
    },
    unreadCount: 0,
    isOnline: false,
  },
];

const MOCK_MESSAGES = {
  c1: [
    { id: "m1", text: "Bonjour, je souhaite réserver un créneau pour les maths.", sentAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), fromMe: true },
    { id: "m2", text: "Bonjour ! Oui, j'ai des dispos jeudi ou vendredi matin.", sentAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), fromMe: false },
    { id: "m3", text: "Jeudi 10h me convient.", sentAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), fromMe: true },
    { id: "m4", text: "Parfait, à jeudi 10h pour le cours de maths !", sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), fromMe: false },
  ],
  c2: [
    { id: "m5", text: "Bonjour, avez-vous des créneaux en anglais cette semaine ?", sentAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), fromMe: true },
    { id: "m6", text: "Merci pour votre message.", sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), fromMe: true },
  ],
};

export const useChatStore = create((set, get) => ({
  conversations: MOCK_CONVERSATIONS.map((c) => ({
    id: c.id,
    name: c.participant.name,
    avatar: c.participant.avatar,
    isOnline: c.isOnline,
    unreadCount: c.unreadCount,
    lastMessage: c.lastMessage ? {
      text: c.lastMessage.text,
      timestamp: c.lastMessage.sentAt,
    } : null,
    participant: c.participant,
  })),
  messagesByConversationId: MOCK_MESSAGES,

  /** Obtenir tous les messages formatés */
  get messages() {
    const allMessages = [];
    Object.keys(get().messagesByConversationId).forEach((convId) => {
      const convMessages = get().messagesByConversationId[convId];
      convMessages.forEach((msg) => {
        allMessages.push({
          id: msg.id,
          conversationId: convId,
          senderId: msg.fromMe ? "current-user" : get().conversations.find((c) => c.id === convId)?.participant?.id || "unknown",
          text: msg.text,
          timestamp: msg.sentAt,
        });
      });
    });
    return allMessages;
  },

  /** Sélectionner une conversation (pour afficher les messages) */
  selectedConversationId: null,
  setSelectedConversationId: (id) => {
    set({ selectedConversationId: id });
    // Marquer comme lu
    if (id) {
      get().markAsRead(id);
    }
  },

  /** Messages de la conversation sélectionnée */
  getMessages: (conversationId) => {
    const rawMessages = get().messagesByConversationId[conversationId] || [];
    const participantId = get().conversations.find((c) => c.id === conversationId)?.participant?.id || "unknown";
    return rawMessages.map((msg) => ({
      id: msg.id,
      conversationId,
      senderId: msg.fromMe ? "current-user" : participantId,
      text: msg.text,
      timestamp: msg.sentAt,
    }));
  },

  /** Envoyer un message (mock ; plus tard WebSocket) */
  sendMessage: (conversationId, text) => {
    const user = get().currentUserId || "current-user";
    const newMsg = {
      id: `msg-${Date.now()}`,
      text,
      sentAt: new Date().toISOString(),
      fromMe: true,
    };
    set((state) => {
      const prev = state.messagesByConversationId[conversationId] || [];
      return {
        messagesByConversationId: {
          ...state.messagesByConversationId,
          [conversationId]: [...prev, newMsg],
        },
        conversations: state.conversations.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                lastMessage: { text, timestamp: newMsg.sentAt },
              }
            : c
        ),
      };
    });
    return newMsg;
  },

  /** Marquer une conversation comme lue */
  markAsRead: (conversationId) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      ),
    }));
  },

  /** Mettre à jour le statut online (mock) */
  setParticipantOnline: (conversationId, isOnline) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, isOnline } : c
      ),
    }));
  },

  /** Total des messages non lus */
  getTotalUnread: () => {
    return get().conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  },

  currentUserId: null,
  setCurrentUserId: (userId) => set({ currentUserId: userId }),
}));
