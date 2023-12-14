import { storage } from "../config/firebase-config";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import {
  equalTo,
  get,
  onValue,
  orderByChild,
  query,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import { db } from "../config/firebase-config";
import {
  ChatInfo,
  DefaultUserData,
  MessageInfo,
  SetChats,
  SetMessages,
} from "../types/types";
import { getUserDataByUid, updateUserData } from "./index.ts";
import { Unsubscribe } from "firebase/auth";
import {
  CHANNELS,
  CHATIDS,
  MESSAGES,
  PARTICIPANTS,
  REACTIONS,
  USERS,
} from "../constants/servicesConstants.ts";

/**
 * Creates the needed records to
 * the database when a chat is created
 * and returns an object with properties
 * "succeess", "error" and "chatId".
 * If the chat between two participants
 * already exists, then no records will
 * be done in the database.
 *
 * @param uid - the user id (chat owner)
 * @param name - the name of the chat.
 * By default this property will be set
 * to the name of the participants.
 * @param participants - an object with
 * keys the uids of the users which are
 * participants of the chat.
 * @param personal - if the chat is private,
 * then it will be true and if the chat is
 * public then the value is false
 * @param type  a chat have
 * to be either chat or channel type.
 */

export const createChat = async (
  { uid, participants, name = "", personal = false, type = "chat" }: {
    uid: string;
    participants: string[];
    name: string;
    personal: boolean;
    type: "chat" | "channel";
  },
): Promise<{ chatId: string | null; success: boolean; error?: string }> => {
  // check if the uid exists
  // generate a chatid
  // check if the participants have already a channel
  // check if the name is taken
  // if no name exists, then set it to empty string
  const channel = await findChannelByParticipantIds(participants);

  if (channel.chatId) {
    console.log("The channel already exist", channel.chatId, channel);
    return { chatId: channel.chatId as string, success: true };
  }

  try {
    const chatId: string = crypto.randomUUID();
    const createdOn = Date.now();
    const participantsObject: {
      [uid: string]: {
        unread: number;
        received: number;
        sent: number;
      };
    } = {};
    let participant: string;

    for (participant of participants) {
      participantsObject[participant] = {
        unread: 0,
        received: 0,
        sent: participant === uid ? 1 : 0,
      };
    }

    await set(ref(db, `${CHANNELS}/${chatId}`), {
      name,
      chatId,
      uid,
      participants: participantsObject,
      personal,
      messages: {},
      type,
      createdOn,
    });

    for (participant of participants) {
      await update(ref(db, `${USERS}/${participant}/${CHATIDS}`), {
        [chatId]: createdOn,
      });
    }

    return { success: true, chatId: chatId };
  } catch (error) {
    return { chatId: null, success: false, error: (error as Error).message };
  }
};

export const getChatInfoListener = (chatId, setChat) => {
  const chatRef = ref(db, `${CHANNELS}/${chatId}`);
  return onValue(chatRef, (snapshot) => {
    const chat = snapshot.val();
    setChat(chat);
  });
};
/**
 * @param chatId - the id of the chat
 * @returns {Promise<{chatInfo: ChatInfo, error?: string}>}
 * The information parameters of the chat
 */
export const getChatInfo = async (
  chatId: string,
): Promise<{ chatInfo?: ChatInfo; error?: string }> => {
  try {
    const chatInfo = await get(ref(db, `${CHANNELS}/${chatId}`));
    return { chatInfo: chatInfo.val() };
  } catch (error) {
    return { error: (error as Error).message };
  }
};

/**
 * Sends message to the messages database
 * field, stores the messageId in the channels
 * database.
 * @param chatId - the id of the chat
 * @param uid - the user id
 * @param content - the content (text message)
 * which is sent
 * @returns {Promise<{success: boolean, error?: string}>}
 * If the message is sent correctly, then returns success
 * with value true, otherwise returns false.
 */
export const addMessageToChat = async ({
  chatId,
  uid,
  content = "",
  type = "text",
}: {
  chatId: string;
  uid: string;
  content: string;
  type: "text" | "gif" | "image" | "file";
}): Promise<
  { success: boolean; error?: string }
> => {
  try {
    const chat = await getChatInfo(chatId);
    if (chat.chatInfo) {
      // const req = await getUserDataByUid(uid);
      // if (req.error) return { success: false, error: req.error };

      if (chat.chatInfo.participants[uid]) {
        if (content) {
          let chatParticipant: string;
          const chatParticipants = Object.keys(chat.chatInfo.participants);
          for (chatParticipant of chatParticipants) {
            const participantRef = ref(
              db,
              `${CHANNELS}/${chatId}/${PARTICIPANTS}/${chatParticipant}`,
            );
            const participantSnapshot = await get(participantRef);
            let data: { unread: number; sent: number; received: number } =
              participantSnapshot.val();
            if (typeof data !== "object") {
              data = { unread: 0, sent: 0, received: 0 };
            }
            await set(participantRef, {
              unread: chatParticipant === uid ? data.unread : data.unread + 1,
              received: chatParticipant === uid ? data.received : data.received + 1,
              sent: chatParticipant === uid ? data.sent + 1 : data.sent,
            });
          }
          const createdOn: number = Date.now();
          const messageId: string = crypto.randomUUID();
          await update(ref(db, `${CHANNELS}/${chatId}/${MESSAGES}`), {
            [messageId]: {
              messageId,
              uid,
              createdOn,
              content,
              reactions: {},
              type,
            },
          });
        }
        return { success: true };
      } else {
        return {
          success: false,
          error: "The user does not exist in the chat participants.",
        };
      }
    } else {
      return {
        success: false,
        error: "Chat with this id or name does not exists.",
      };
    }
  } catch (error) {
    console.log(error);
    return { success: false, error: (error as Error).message };
  }
};

export const clearReadMessages = async (
  chatId: string,
  uid: string,
): Promise<
  { success: boolean; error?: string; chatId: string; uid: string }
> => {
  try {
    const participantRef = ref(
      db,
      `${CHANNELS}/${chatId}/${PARTICIPANTS}/${uid}/unread`,
    );
    await set(participantRef, 0);
    return { success: true, chatId, uid };
  } catch (error) {
    return { success: false, error: (error as Error).message, chatId, uid };
  }
};

export const addChatParticipants = async ({ chatId, participants }: {
  chatId: string;
  participants: string[];
}): Promise<{
  success: boolean;
  error?: string;
}> => {
  const participantsObject: {
    [uid: string]: number;
  } = {};
  const createdOn = Date.now();
  let participant: string;
  for (participant of participants) {
    participantsObject[participant] = { unread: 0, received: 0, sent: 0 };
    await update(ref(db, `${USERS}/${participant}/${CHATIDS}`), {
      [chatId]: createdOn,
    });
  }
  try {
    await update(
      ref(db, `${CHANNELS}/${chatId}/${PARTICIPANTS}`),
      participantsObject,
    );
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

export const getChannels = async (): Promise<
  ChatInfo[] | null
> => {
  try {
    const snapshot = await get(ref(db, `${CHANNELS}`));
    const chats = snapshot.val();
    return Object.values(chats);
  } catch (error) {
    console.log((error as Error).message);
    return null;
  }
};

export const findChannelByParticipantIds = async (
  ids: string[],
): Promise<{ chatId: string | null }> => {
  const channels = await getChannels();
  let channel: ChatInfo | null = null;
  if (channels) {
    for (const currentChannel of channels) {
      if (
        ids.every((id) =>
          typeof (currentChannel as ChatInfo).participants[id] !== "undefined"
        )
      ) {
        channel = currentChannel;
        break;
      }
    }
    if (channel) {
      if (Object.keys(channel.participants).length === ids.length) {
        return { chatId: channel.chatId as string };
      }
    }
  }
  return { chatId: null };
};

export const getChannelsByUid = async (
  uid: string,
  type: "chat" | "channel" = "chat",
) => {
  const channelsRef = ref(db, `${CHANNELS}`);
  const snapshot = await get(channelsRef);
  const channelsData = snapshot.val();
  if (channelsData) {
    const channels: ChatInfo[] = Object.values(snapshot.val());
    const userChannels = channels.filter((channel) =>
      channel.participants[uid] && channel.type === type
    );
    return userChannels;
  }
  return [];
};

export const getChannelsByUID = (
  uid: string,
  setChats: SetChats,
  type: "chat" | "channel" = "chat",
): Unsubscribe => {
  const chatsRef = ref(db, `${CHANNELS}`);
  return onValue(chatsRef, (snapshot) => {
    if (snapshot.exists()) {
      const result = snapshot.val();
      if (result) {
        // select only the chats which have as participants
        // the current uid
        const chats: ChatInfo[] = Object.values(result);
        const userChats = chats.filter((chat) =>
          chat.participants[uid] && chat.type === type
        );
        console.log("I was changed");
        // get for each chat get the username, avatarUrl.
        setChats([...userChats]);
      }
    }
  });
};

export const getChatMessages = async (
  chatId: string,
): Promise<{ messages: MessageInfo[] | null; error?: string }> => {
  const messagesRef = ref(db, `${CHANNELS}/${chatId}/${MESSAGES}`);
  try {
    const req = await get(messagesRef);
    const messages: MessageInfo[] = (Object.values(req.val()) as MessageInfo[])
      .sort((m1, m2) =>
        (m1 as MessageInfo).createdOn < (m2 as MessageInfo).createdOn ? -1 : 1
      );
    return { messages };
  } catch (error) {
    return { messages: [], error: (error as Error).message };
  }
};

export const setMessagesListener = (
  chatId: string,
  setMessages: SetMessages,
): Unsubscribe => {
  const messagesRef = ref(db, `${CHANNELS}/${chatId}/${MESSAGES}`);
  return onValue(messagesRef, (snapshot) => {
    if (snapshot.exists()) {
      if (snapshot.val()) {
        console.log("was changed");
        const messages: MessageInfo[] = Object.values(snapshot.val());
        setMessages(
          [...messages.sort((m1, m2) => m1.createdOn < m2.createdOn ? -1 : 1)],
        );
      } else setMessages([]);
    }
  });
};

export const removeMessageFromChat = async (
  chatId: string,
  messageId: string,
): Promise<
  { success: boolean; chatId: string; messageId: string; error?: string }
> => {
  try {
    const messageRef = ref(
      db,
      `${CHANNELS}/${chatId}/${MESSAGES}/${messageId}`,
    );
    await remove(messageRef);
    return { success: true, chatId, messageId };
  } catch (error) {
    return {
      success: false,
      messageId,
      chatId,
      error: (error as Error).message,
    };
  }
};

export const addReactionToChat = async (
  reaction: string,
  chatId: string,
  messageId: string,
  uid: string,
): Promise<
  {
    success: boolean;
    reaction: string;
    chatId: string;
    messageId: string;
    uid: string;
    error?: string;
  }
> => {
  try {
    const messageRef = ref(
      db,
      `${CHANNELS}/${chatId}/${MESSAGES}/${messageId}/${REACTIONS}/${reaction}`,
    );
    await update(messageRef, { [uid]: Date.now() });
    return { success: true, reaction, chatId, messageId, uid };
  } catch (error) {
    return {
      success: false,
      reaction,
      chatId,
      messageId,
      uid,
      error: (error as Error).message,
    };
  }
};

export const removeReactionFromChat = async (
  reaction: string,
  chatId: string,
  messageId: string,
  uid: string,
): Promise<
  {
    success: boolean;
    reaction: string;
    chatId: string;
    messageId: string;
    uid: string;
    error?: string;
  }
> => {
  try {
    const reactionRef = ref(
      db,
      `${CHANNELS}/${chatId}/${MESSAGES}/${messageId}/${REACTIONS}`,
    );
    const snapshot = await get(reactionRef);
    const data = snapshot.val();
    if (data[reaction]) {
      const userReactionRef = ref(
        db,
        `${CHANNELS}/${chatId}/${MESSAGES}/${messageId}/${REACTIONS}/${reaction}/${uid}`,
      );
      const req = await get(userReactionRef);
      const reactionObject = req.val();
      await remove(userReactionRef);
    }
    return {
      success: true,
      reaction,
      chatId,
      messageId,
      uid,
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
      reaction,
      chatId,
      messageId,
      uid,
    };
  }
};

export const getMessageReactions = async (
  chatId: string,
  messageId: string,
): Promise<
  {
    reactions: Map<string, number> | null;
    success: boolean;
    error?: string;
    chatId: string;
    messageId: string;
  }
> => {
  let key: string;
  try {
    const reactionsRef = ref(
      db,
      `${CHANNELS}/${chatId}/${MESSAGES}/${messageId}/${REACTIONS}`,
    );
    const req = await get(reactionsRef);
    const reactionsObject = req.val();
    const reactions = new Map();
    if (reactionsObject) {
      for (key in reactionsObject) {
        reactions.set(key, Object.keys(reactionsObject[key]).length);
      }
    }
    return {
      success: true,
      reactions,
      messageId,
      chatId,
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
      reactions: null,
      chatId,
      messageId,
    };
  }
};

export const deleteChannel = async (
  chatId: string,
): Promise<{ chatId: string; success: boolean; error?: string }> => {
  let uid: string;
  try {
    // get the user ids of the channel:
    const snapshot = await get(
      ref(db, `${CHANNELS}/${chatId}/${PARTICIPANTS}`),
    );
    const uids: string[] = Object.keys(snapshot.val());
    // delete the chatId from the chatids property of every user
    await remove(ref(db, `${CHANNELS}/${chatId}`));
    for (uid of uids) {
      const usernameSnapshot = await get(ref(db, `${USERS}/${uid}/username`));
      const username = usernameSnapshot.val();
      console.log(
        `deleted chat id ${chatId} for user ${username} with uid: ${uid}`,
      );
      await remove(ref(db, `${USERS}/${uid}/${CHATIDS}/${chatId}`));
    }
    // delete the Channel
    return { chatId, success: true };
  } catch (error) {
    return { chatId, success: false, error: (error as Error).message };
  }
};

export const deleteChannelForUser = async (
  { uid, chatId }: { uid: string; chatId: string },
): Promise<{ success: boolean; error?: string }> => {
  try {
    await remove(ref(db, `${USERS}/${uid}/${CHATIDS}/${chatId}`));
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

export const updateMessage = async (
  messageId: string,
  chatId: string,
  content: string,
) => {
  const messageRef = ref(db, `${CHANNELS}/${chatId}/messages/${messageId}`);
  const messageUpdate = { content: `${content}`, edited: true };
  await update(messageRef, messageUpdate);
};

export const uploadChatImage = async (image: File) => {
  const imageId = crypto.randomUUID();
  const storageImageRef = storageRef(storage, `/chat_images/${imageId}`);
  await uploadBytes(storageImageRef, image);

  const url = await getDownloadURL(storageImageRef);
  return url;
};

export const addMessageToChatNew = async ({
  chatId,
  uid,
  content = "",
  type = 'text'
}: { 
  chatId: string; 
  uid: string; 
  content: string 
  type: "text" | "gif" | "image" | "file"}): Promise<
  { success: boolean; error?: string }> => {
  try {
    if (content) {
      const createdOn: number = Date.now();
      const messageId: string = crypto.randomUUID();
      await update(ref(db, `${CHANNELS}/${chatId}/${MESSAGES}`), {
        [messageId]: {
          messageId,
          uid,
          createdOn,
          content,
          reactions: {},
          type
        },
      });
    }
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: (error as Error).message };
  }
}

export const updateChatInfo = async (chatId: string, uid: string) => {
  try {
    const chat = await getChatInfo(chatId);

    if (chat.chatInfo) {
      const req = await getUserDataByUid(uid);

      if (req.error) {
        return { success: false, error: req.error };
      }

      if (chat.chatInfo.participants[uid]) {
        let chatParticipant: string;
        const chatParticipants = Object.keys(chat.chatInfo.participants);

        for (chatParticipant of chatParticipants) {
          const participantRef = ref(
            db, `${CHANNELS}/${chatId}/participants/${chatParticipant}`,
          );
          const participantSnapshot = await get(participantRef);
          let data: { unread: number; sent: number; received: number } =
            participantSnapshot.val();
          if (typeof data !== "object") {
            data = { unread: 0, sent: 0, received: 0 };
          }
          await set(participantRef, {
            unread: chatParticipant === uid ? data.unread : data.unread + 1,
            received: chatParticipant === uid ? data.received : data.received + 1,
            sent: chatParticipant === uid ? data.sent + 1 : data.sent,
          });
        }

        return { success: true };
      } else {
        return {
          success: false,
          error: "Chat with this id or name does not exist.",
        };
      }
    }
  } catch (error) {
    console.error(error);
  }
}
