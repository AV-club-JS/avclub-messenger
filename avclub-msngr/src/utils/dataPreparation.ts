"use strict";

import { Chat, ChatInfo, ChatsCollection } from "../types/types";

export const getLastChatMessage = (chat: Chat): string => {
  const messages = Object.values(chat);
  return messages[messages.length - 1].content;
};

export const getLastChat = (chats: ChatsCollection): ChatInfo => chats[chats.length - 1];
