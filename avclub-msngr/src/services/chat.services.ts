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
  CHANELS,
  CHATIDS,
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
 * to be either chat or chanel type.
 */

export const createChat = async (
  { uid, participants, name = "", personal = false, type = "chat" }: {
    uid: string;
    participants: string[];
    name: string;
    personal: boolean;
    type: "chat" | "chanel";
  },
): Promise<{ chatId: string | null; success: boolean; error?: string }> => {
  // check if the uid exists
  // generate a chatid
  // check if the participants have already a chanel
  // check if the name is taken
  // if no name exists, then set it to empty string
  const chanel = await findChanelByParticipantIds(participants);
  if (chanel.chatId) {
    console.log("The chanel already exist", chanel.chatId, chanel);
    return { chatId: chanel.chatId as string, success: true };
  }
  try {
    const chatId: string = crypto.randomUUID();
    const createdOn = Date.now();

    await set(ref(db, `chanels/${chatId}`), {
      name,
      chatId,
      uid,
      personal,
      messages: {},
      type,
      createdOn,
    });
    const addParticipants = await addChatParticipants({
      chatId,
      participants,
    });

    if (!addParticipants.success) {
      return { chatId: null, success: false, error: addParticipants.error };
    }
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
    const chatInfo = await get(ref(db, `chanels/${chatId}`));
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
        const createdOn: number = Date.now();
        const messageId: string = crypto.randomUUID();
        await update(ref(db, `chanels/${chatId}/messages`), {
          [messageId]: {
            messageId,
            uid,
            createdOn,
            content,
            reactions: {},
          },
        });
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
    await update(ref(db, `users/${participant}/chatids`), {
      [chatId]: createdOn,
    });
  }
  try {
    await update(ref(db, `chanels/${chatId}/participants`), participantsObject);
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

export const getChanels = async (): Promise<
  ChatInfo[] | null
> => {
  try {
    const snapshot = await get(ref(db, `chanels`));
    const chats = snapshot.val();
    return Object.values(chats);
  } catch (error) {
    console.log("I am here!!!");
    console.log((error as Error).message);
    return null;
  }
};

export const findChanelByParticipantIds = async (
  ids: string[],
): Promise<{ chatId: string | null }> => {
  const chanels = await getChanels();
  let chanel: ChatInfo | null = null;
  if (chanels) {
    for (const currentChanel of chanels) {
      if (
        ids.every((id) =>
          typeof (currentChanel as ChatInfo).participants[id] !== "undefined"
        )
      ) {
        chanel = currentChanel;
        break;
      }
    }
    if (chanel) {
      if (Object.keys(chanel.participants).length === ids.length) {
        return { chatId: chanel.chatId as string };
      }
    }
  }
  return { chatId: null };
};

export const getChanelsByUid = async (uid: string) => {
  const chanelsRef = ref(db, "chanels");
  const snapshot = await get(
    query(chanelsRef, orderByChild("uid"), equalTo(uid)),
  );
  return snapshot.val();
};

export const getChanelsByUID = (
  uid: string,
  setChats: SetChats,
): Unsubscribe => {
  const chatsRef = ref(db, `chanels`);
  return onValue(chatsRef, (snapshot) => {
    if (snapshot.exists()) {
      const result = snapshot.val();
      if (result) {
        // select only the chats which have as participants
        // the current uid
        const chats: ChatInfo[] = Object.values(result);
        console.log(chats);
        const userChats = chats.filter((chat) => chat.participants[uid]);
        // get for each chat get the username, avatarUrl.
        setChats(userChats);
      }
    }
  });
};

export const getChatMessages = async (
  chatId: string,
): Promise<{ messages: MessageInfo[] | null; error?: string }> => {
  const messagesRef = ref(db, `chanels/${chatId}/messages`);
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
  const messagesRef = ref(db, `chanels/${chatId}/messages`);
  return onValue(messagesRef, (snapshot) => {
    if (snapshot.exists()) {
      if (snapshot.val()) {
        const messages: MessageInfo[] = Object.values(snapshot.val());
        setMessages(messages);
      } else setMessages([]);
    }
  });
};

export const deleteChanel = async (
  chatId: string,
): Promise<{ chatId: string; success: boolean; error?: string }> => {
  let uid: string;
  try {
    // get the user ids of the chanel:
    const snapshot = await get(ref(db, `${CHANELS}/${chatId}/${PARTICIPANTS}`));
    const uids: string[] = Object.values(snapshot.val());
    // delete the chatId from the chatids property of every user
    for (uid of uids) await remove(ref(db, `${USERS}/${CHATIDS}/${uid}`));
    // delete the Chanel
    await remove(ref(db, `${CHANELS}/${chatId}`));
    return { chatId, success: true };
  } catch (error) {
    return { chatId, success: false, error: (error as Error).message };
  }
};

export const deleteChanelForUser = async (
  { uid, chatId }: { uid: string; chatId: string },
): Promise<{ success: boolean; error?: string }> => {
  try {
    await remove(ref(db, `${USERS}/${uid}/${CHATIDS}/${chatId}`));
    return {success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message};
  }
};
