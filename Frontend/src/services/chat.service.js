/**
 * Service du chat (conversations et messages).
 */

import api from "./api";

const PREFIX = "/api";

export const chatService = {
  async getConversations() {
    const { data } = await api(`${PREFIX}/conversations`);
    return data ?? [];
  },

  async getMessages(conversationId) {
    const { data } = await api(`${PREFIX}/conversations/${conversationId}/messages`);
    return data ?? [];
  },

  async sendMessage(conversationId, message) {
    const { data } = await api(`${PREFIX}/messages`, {
      method: "POST",
      body: { conversation_id: conversationId, message },
    });
    return data;
  },

  async findOrCreateConversation(otherUserId) {
    const { data } = await api(`${PREFIX}/conversations/find-or-create/${otherUserId}`, {
      method: "POST",
    });
    return data;
  },
};

export default chatService;
