import { ChatInfo, DefaultUserData } from "../../types/types";
import { Unsubscribe } from "firebase/auth";
import { Box, Text, VStack } from "@chakra-ui/react";
import { ChatCard } from "../ChatCard";
import { ChatContentContainer } from "../ChatContentContainer";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getLastChatMessage } from "../../utils/dataPreparation";
import { getChannelsByUID } from "../../services";
export const ChatsComponent = ({ chats, setChats, userData }: { 
  chats: ChatInfo[] 
  setChats: Dispatch<SetStateAction<ChatInfo[]>>
  userData: DefaultUserData
}) => {
  const [selectedChat, setSelectedChat] = useState<ChatInfo | {}>({});
  useEffect(() => {
    let disconnect: Unsubscribe;
    try {
      disconnect = getChannelsByUID(
        userData?.uid as string,
        setChats,
      );
    } catch (error) {
      console.log((error as Error).message);
    }
    return () => {
      return disconnect();
    };
  }, []);

  useEffect(() => {
    setSelectedChat((selectedChatProp: ChatInfo | null) => {
      return chats && !Object.keys(selectedChatProp as object).length ? {...chats[0]} : {...selectedChatProp};
    });
  }, [chats]);

  return (
    <>
      <VStack
        h="100%"
        w="24vw"
        flexDir={"column"}
        overflowX={"hidden"}
        p={1}
      >
        {chats
          ? chats.map((chat) => (
            <ChatCard
              key={chat.chatId}
              isActive={(selectedChat as ChatInfo)?.chatId === chat.chatId}
              name={chat.name}
              participants={Object.keys(chat?.participants)}
              lastMessage={getLastChatMessage(chat) as string}
              onClick={() => {
                setSelectedChat(chat);
              }}
            />
          ))
          : (
            <Box>
              <Text>
                No chats to display.
              </Text>
            </Box>
          )}
      </VStack>
      {selectedChat && (
        <ChatContentContainer
          chat={selectedChat as ChatInfo}
        />
      )}
    </>
  );
};
