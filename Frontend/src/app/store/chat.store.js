// src/app/store/chat.store.js
import { create } from "zustand";
import { chatService } from "../../services";

function mapConversation(c) {
  const participant = c.participant ?? c.participants?.[0];
  return {
    id: c.id,
    name: participant?.name,
    avatar: null,
    isOnline: false,
    unreadCount: c.unread_count ?? c.unreadCount ?? 0,
    lastMessage: c.last_message
      ? {
          text: c.last_message.text ?? c.last_message.message,
          timestamp: c.last_message.sent_at ?? c.last_message.timestamp,
        }
      : null,
    participant: participant
      ? { id: participant.id, name: participant.name, avatar: null, role: "teacher" }
      : null,
  };
}

function mapMessage(m) {
  return {
    id: m.id,
    text: m.text ?? m.message,
    sentAt: m.timestamp ?? m.sent_at ?? m.created_at,
    fromMe: m.from_me ?? m.fromMe,
  };
}

export const useChatStore = create((set, get) => ({
  conversations: [],
  messagesByConversationId: {},
  selectedConversationId: null,

  fetchConversations: async () => {
    try {
      const data = await chatService.getConversations();
      const list = (data ?? []).map(mapConversation);
      set({ conversations: list });
      return list;
    } catch {
      set({ conversations: [] });
      return [];
    }
  },

  getMessages: (conversationId) => {
    return get().messagesByConversationId[conversationId] ?? [];
  },

  fetchMessagesForConversation: async (conversationId) => {
    try {
      const data = await chatService.getMessages(conversationId);
      const list = (data ?? []).map(mapMessage);
      set((state) => ({
        messagesByConversationId: {
          ...state.messagesByConversationId,
          [conversationId]: list,
        },
      }));
      return list;
    } catch {
      return [];
    }
  },

  setSelectedConversationId: (id) => {
    set({ selectedConversationId: id });
    if (id) {
      get().markAsRead(id);
      get().fetchMessagesForConversation(id);
    }
  },

  sendMessage: async (conversationId, text) => {
    try {
      const data = await chatService.sendMessage(conversationId, text);
      const msg = mapMessage(data);
      set((state) => {
        const prev = state.messagesByConversationId[conversationId] ?? [];
        return {
          messagesByConversationId: {
            ...state.messagesByConversationId,
            [conversationId]: [...prev, msg],
          },
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? { ...c, lastMessage: { text, timestamp: msg.sentAt } }
              : c
          ),
        };
      });
      return msg;
    } catch (e) {
      throw e;
    }
  },

  markAsRead: (conversationId) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      ),
    }));
  },

  setParticipantOnline: (conversationId, isOnline) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, isOnline } : c
      ),
    }));
  },

  getTotalUnread: () => {
    return get().conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  },

  currentUserId: null,
  setCurrentUserId: (userId) => set({ currentUserId: userId }),
}));
