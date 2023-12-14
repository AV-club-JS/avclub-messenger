"use strict";
import { Box, Button, Flex, IconButton } from "@chakra-ui/react";
import { ChatInfo, DefaultUserData, MessageInfo } from "../../types/types";
import { MessageContainer } from "../MessageContainer";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getChatMessages,
  getUsersByUIDs,
  setMessagesListener,
  updateChatInfo,
  addMessageToChatNew
} from "../../services";
import { NoMessages } from "../NoMessages";
import { Unsubscribe } from "firebase/auth";
import { UserContext } from "../../context/AuthContext";
import { AdditionalSettingsBar } from "../AdditionalSettingsBar";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/js/plugins.pkgd.min.js";
import FroalaEditorComponent from "react-froala-wysiwyg";
import { froalaMessageConfig } from "../../utils/profileUtils";
import { Messages } from "../Messages";
import { Loading } from "../Loading";
import { useParams } from "react-router-dom";
import { getChatInfoListener } from "../../services";
import { IoMdSend } from "react-icons/io";

export const ChatContentContainer = () => {
  const { chatId: chatIdUrl } = useParams();
  const [chat, setChat] = useState<ChatInfo>({});
  const { userData } = useContext(UserContext);
  const [messages, setMessages] = useState<MessageInfo[] | null>(null);
  const [participants, setParticipants] = useState<DefaultUserData[]>([]);
  const [insertedMessage, setInsertedMessage] = useState<string>("");
  const [name, setName] = useState("");

  useEffect(() => {
    const onUnmount = getChatInfoListener(chatIdUrl, setChat);
    return () => {
      console.log(2);
      return onUnmount();
    };
  }, [chatIdUrl]);

  useEffect(() => {
    (async () => {
      if (chat.participants) {
        const users = await getUsersByUIDs(Object.keys(chat.participants));
        setParticipants(users);
        setName(
          chat.name ||
          participants
            .filter((participant) => participant?.uid !== userData?.uid)
            .map((participant) => participant.username)
            .join(","),
        );
        const req = await getChatMessages(chat?.chatId as string);
        const __messages: MessageInfo[] = req.messages as MessageInfo[];
        setMessages(__messages);
      }
    })();
  }, [chat]);

  useEffect(() => {
    let disconnect: Unsubscribe;
    try {
      disconnect = setMessagesListener(chat.chatId as string, setMessages);
    } catch (error) {
      console.log((error as Error).message);
    }
    return () => {
      console.log(1);
      return disconnect();
    };
  }, []);

  const handleMessage = async () => {
    setInsertedMessage("");

    await addMessageToChatNew({
      chatId: chat.chatId as string,
      uid: userData!.uid as string,
      content: insertedMessage
    });

    await updateChatInfo(chat.chatId!, userData!.uid);
  };

  return (
    <Flex
      flexDir={"column"}
      w={"90%"}
      maxW={"100%"}
      h="100%"
      p={2}
      mb={1}
      overflowX={"hidden"}
    >
      <AdditionalSettingsBar
        participants={participants}
        name={name}
        chatId={chat.chatId as string}
        roomId={chat.roomId as string}
      />
      {messages == null ?
        <Loading />
        :
        <MessageContainer>
          <>
            {messages.length !== 0
              ? (
                <Messages
                  chatId={chat.chatId as string}
                  messages={messages}
                />
              )
              : (
                <NoMessages />
              )}
          </>
        </MessageContainer>}
      <Flex
        flex={"1 1 20%"}
      >
        <Box m={1} w='85%'>
          <FroalaEditorComponent
            model={insertedMessage}
            onModelChange={(e: string) => setInsertedMessage(e)}
            config={froalaMessageConfig}
          />
        </Box>
        <IconButton
          aria-label='Send'
          icon={<IoMdSend />}
          m={2}
          size='lg'
          fontSize='30px'
          color={"brand.accent"}
          variant={"outline"}
          _hover={{
            bg: "brand.primary",
            color: "brand.accent",
          }}
          onClick={handleMessage}
        />
      </Flex>
    </Flex>
  );
};
