import { Chat, ChatInfo, ChatsCollection } from "../types/types";

export const getLastChatMessage = (chat: ChatInfo): string | null => {
  if (chat.messages) {
    let messages = Object.values(chat.messages as Chat);
    messages = messages.sort((m1, m2) => m1.createdOn < m2.createdOn ? -1 : 1);
    const type = messages[messages.length - 1].type;
    switch(type) {
      case 'gif':
        return '<div>GIF</div>';
      case 'file':
        return '<div>file</div>';
      case 'image':
        return '<div>image</div>';
      case 'text': 
        return messages[messages.length - 1].content;
    }
  }
  return null;
};

export const getLastChat = (chats: ChatsCollection): ChatInfo =>
  chats[chats.length - 1];
