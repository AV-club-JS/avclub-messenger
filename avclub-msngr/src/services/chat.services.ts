import { get, ref, set, update } from "firebase/database";

import { db } from "../config/firebase-config";
import { ChatInfo } from "../types/types";
import { getUserDataByUid, updateUserData } from "./index.ts";

/**
 * Creates the needed records to
 * the database when a chat is created.
 *
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
export const createChat = async ({
  name,
  uid,
  personal = false,
  type,
}: ChatInfo): Promise<{ success: boolean; error?: string }> => {
  try {
    const chatId: string = crypto.randomUUID();
    // record the data of the chat in the
    // chanels field of the database.
    const createdOn = Date.now();
    const userIsUpdated = await updateUserData(uid, {
      chatids: { chatId: createdOn },
    });
    if (!userIsUpdated) {
      return { success: false, error: "Incorrect uid for this user." };
    }
    await set(ref(db, `chanels/${chatId}`), {
      chatId,
      uid,
      name,
      owner: uid,
      participants: {
        [uid]: createdOn,
      },
      personal,
      messages: {},
      type,
      createdOn,
    });
    console.log("new chat created...");
    return { success: true };
  } catch (error) {
    console.log((error as Error).message);
    return { success: false, error: (error as Error).message };
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
        await update(ref(db, `messages`), {
          [messageId]: {
            author: uid,
            userename: user?.username,
            avatarUrl: user?.avatarUrl,
            createdOn,
            content,
          },
        });
        await update(ref(db, `chanels/${chatId}/messages`), {
          [messageId]: createdOn,
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

const addChatPatricipants = async ({ chatId, participants }: {
  chatId: string;
  participants: string[];
}): Promise<{
  success: boolean;
  error?: string;
}> => {
  const participantsObject = {};
  const createdOn = Date.now();

  for (participant of participants) participantsObject[participant] = createdOn;
  try {
    await update(ref(db, `chanels/${chatId}/participants`), {
      participantsObject,
    });
    await updateUserData(uid, {})
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};
