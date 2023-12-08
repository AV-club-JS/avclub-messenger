"use strict";

import { Chat, ChatInfo, ChatsCollection } from "../types/types";

export const getLastChatMessage = (chat: ChatInfo): string | null => {
  if (chat.messages) {
    let messages = Object.values(chat.messages as Chat);
    messages = messages.sort((m1, m2) => m1.createdOn < m2.createdOn ? -1 : 1);
    return messages[messages.length - 1].content;
  }
  return null;
};

export const getLastChat = (chats: ChatsCollection): ChatInfo =>
  chats[chats.length - 1];
