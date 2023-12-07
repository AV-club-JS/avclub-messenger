"use strict";
import {
  Box,
  Button,
  Flex,
  Stack,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { ChatBar } from "../ChatBar";
import { ChatInfo, DefaultUserData, MessageInfo } from "../../types/types";
import { MessageContainer } from "../MessageContainer";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { getChatMessages, getUsersByUIDs, setMessagesListener } from "../../services";
import { MessageComponent } from "../MessageComponent";
import { NoMessages } from "../NoMessages";
import { Unsubscribe } from "firebase/auth";
import { UserContext } from "../../context/AuthContext";
import { AdditionalSettingsBar } from "../AdditionalSettingsBar";
import { addMessageToChat } from "../../services";

export const ChatContentContainer = ({ chat }: { chat: ChatInfo }) => {
  const { userData } = useContext(UserContext);
  const [messages, setMessages] = useState<MessageInfo[] | []>([]);
  const [participants, setParticipants] = useState<DefaultUserData[]>([]);
  const [insertedMessage, setInsertedMessage] = useState<string>("");

  useEffect(() => {
    let disconnect: Unsubscribe;
    try {
      disconnect = setMessagesListener(chat.chatId as string, setMessages);
    } catch (error) {
      console.log((error as Error).message);
    }
    return () => disconnect();
  }, []);

  useEffect(() => {
    (async () => {
      const users = await getUsersByUIDs(Object.keys(chat.participants));
      setParticipants(users);
      const req = await getChatMessages(chat?.chatId as string);
      const messages = req.messages;
      if (messages) setMessages(messages.sort((m1, m2) => m1.createdOn < m2.createdOn ? -1 : 1));
    })();
  }, [chat]);

  const handleMessage = async () => {
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
      m={0}
      overflowX={'hidden'}
    >
      <AdditionalSettingsBar
        participants={participants}
        name={name}
      />
      <MessageContainer>
        <>
          {messages.length
            ? messages.map((data: MessageInfo) => (
              <MessageComponent key={data.messageId} message={data} />
            ))
            : (
              <NoMessages
                senderName={(userData as DefaultUserData).username}
                receiverName={name}
              />
            )}
        </>
      </MessageContainer>
      <Flex
        flex={"1 1 20%"}
      >
        <Textarea
          m={2}
          w={"80%"}
          placeholder="Insert your message here"
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setInsertedMessage(e.target.value)}
        />
        <Button
          m={2}
          size={'lg'}
          color={'brand.primary'}
          variant={'ghost'}
          _hover={{
            bg: 'brand.primary',
            color: 'brand.accent',
          }}
          onClick={handleMessage}
        >
          Send
        </Button>
      </Flex>
    </Flex>
  );
};
