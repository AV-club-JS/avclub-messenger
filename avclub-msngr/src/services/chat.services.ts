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
      [uid: string]: number;
    } = {};
    let participant: string;
    for (participant of participants) {
      participantsObject[participant] = createdOn;
      await update(ref(db, `${USERS}/${participant}/${CHATIDS}`), {
        [chatId]: createdOn,
      });
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
    // const addParticipants = await addChatParticipants({
    //   chatId,
    //   participants,
    // });
    console.log("new chat created...");
    return { success: true, chatId: chatId };
  } catch (error) {
    console.log("I fall here!!!");
    return { chatId: null, success: false, error: (error as Error).message };
  }
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
 * field, stores the messageId in the chanenls
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
}: { chatId: string; uid: string; content: string }): Promise<
  { success: boolean; error?: string }
> => {
  try {
    const chat = await getChatInfo(chatId);
    if (chat.chatInfo) {
      const req = await getUserDataByUid(uid);
      if (req.error) return { success: false, error: req.error };
      const user = req.data;
      if (chat.chatInfo.participants[uid]) {
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
    participantsObject[participant] = createdOn;
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

export const getChannelsByUid = async (uid: string, type: 'chat' | 'channel' = 'chat') => {
  const channelsRef = ref(db, `${CHANNELS}`);
  const snapshot = await get(channelsRef);
  const channels: ChatInfo[] = Object.values(snapshot.val());
  const userChannels = channels.filter((channel) => channel.participants[uid] && channel.type === type);
  return userChannels || [];
};

export const getChannelsByUID = (
  uid: string,
  setChats: SetChats,
  type: 'chat' | 'channel' = 'chat'
): Unsubscribe => {
  const chatsRef = ref(db, `${CHANNELS}`);
  return onValue(chatsRef, (snapshot) => {
    if (snapshot.exists()) {
      const result = snapshot.val();
      if (result) {
        // select only the chats which have as participants
        // the current uid
        const chats: ChatInfo[] = Object.values(result);
        const userChats = chats.filter((chat) => chat.participants[uid] && chat.type === type);
        // get for each chat get the username, avatarUrl.
        setChats(userChats);
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
    const messages: MessageInfo[] = Object.values(req.val());
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
        const messages: MessageInfo[] = Object.values(snapshot.val());
        setMessages(
          messages.sort((m1, m2) => m1.createdOn < m2.createdOn ? -1 : 1),
        );
      } else setMessages([]);
    }
  });
};

export const removeMessageFromChat = async (
  chatId: string,
  messageId: stirng,
): Promise<
  { success: boolean; chatId: string; messageId: string; error?: string }
> => {
  try {
    const messageRef = ref(db, `${CHANNELS}/${chatId}/${MESSAGES}/${messageId}`);
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
  return null;
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
    const uids: string[] = Object.values(snapshot.val());
    // delete the chatId from the chatids property of every user
    for (uid of uids) await remove(ref(db, `${USERS}/${CHATIDS}/${uid}`));
    // delete the Channel
    await remove(ref(db, `${CHANNELS}/${chatId}`));
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
