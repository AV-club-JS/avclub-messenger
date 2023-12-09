"use strict";
import { Box, Button, Flex } from "@chakra-ui/react";
import { ChatInfo, DefaultUserData, MessageInfo } from "../../types/types";
import { MessageContainer } from "../MessageContainer";
import { useContext, useEffect, useRef, useState } from "react";
import {
  getChatMessages,
  getUsersByUIDs,
  setMessagesListener,
} from "../../services";
import { MessageComponent } from "../MessageComponent";
import { NoMessages } from "../NoMessages";
import { Unsubscribe } from "firebase/auth";
import { UserContext } from "../../context/AuthContext";
import { AdditionalSettingsBar } from "../AdditionalSettingsBar";
import { addMessageToChat } from "../../services";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/js/plugins.pkgd.min.js";
import FroalaEditorComponent from "react-froala-wysiwyg";
import { froalaMessageConfig } from "../../utils/profileUtils";
import { Messages } from "../Messages";
// import { Messages } from "../Messages";
export const ChatContentContainer = ({ chat }: { chat: ChatInfo }) => {
  const { userData } = useContext(UserContext);
  const [messages, setMessages] = useState<MessageInfo[] | []>([]);
  const [participants, setParticipants] = useState<DefaultUserData[]>([]);
  const [insertedMessage, setInsertedMessage] = useState<string>("");
  useEffect(() => {
    (async () => {
      const users = await getUsersByUIDs(Object.keys(chat.participants));
      setParticipants(users);
      const req = await getChatMessages(chat?.chatId as string);
      const messages = req.messages;
      if (messages) {
        setMessages(messages);
      }
    })();
  }, [chat, messages]);

  useEffect(() => {
    let disconnect: Unsubscribe;
    try {
      disconnect = setMessagesListener(chat.chatId as string, setMessages);
    } catch (error) {
      console.log((error as Error).message);
    }
    return () =>{
      console.log('The messages was disconnected')
      return  disconnect();
    } 
  }, []);
  const handleMessage = async () => {
    setInsertedMessage("");
    const sendedMessage = await addMessageToChat({
      chatId: chat.chatId as string,
      uid: userData?.uid as string,
      content: insertedMessage,
    });
  };

  const name = chat.name ||
    participants
      .filter((participant) => participant?.uid !== userData?.uid)
      .map((participant) => participant.username)
      .join(",");
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
      />
      <MessageContainer>
        <>
          {messages.length !== 0 &&
            <Messages user={userData as DefaultUserData} messages={messages} />}
        </>
      </MessageContainer>
      <Flex
        flex={"1 1 20%"}
      >
        <Box m={1}>
          <FroalaEditorComponent
            model={insertedMessage}
            onModelChange={(e: string) => setInsertedMessage(e)}
            config={froalaMessageConfig}
          />
        </Box>
        <Button
          m={2}
          size={"lg"}
          color={"brand.primary"}
          variant={"ghost"}
          _hover={{
            bg: "brand.primary",
            color: "brand.accent",
          }}
          onClick={handleMessage}
        >
          Send
        </Button>
      </Flex>
    </Flex>
  );
};
