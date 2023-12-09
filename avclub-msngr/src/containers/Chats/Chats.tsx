import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { ChatInfo, ChatsCollection, DefaultUserData } from "../../types/types";
import { ChatContentContainer } from "../../components/ChatContentContainer";
import { getLastChat, getLastChatMessage } from "../../utils/dataPreparation";
import { UserContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { ChatCard } from "../../components/ChatCard";
import {
  getChannelsByUID,
  getChannelsByUid,
} from "../../services";
import { Unsubscribe } from "firebase/auth";

export const Chats = () => {
  const { userData, setAuth } = useContext(UserContext);
  const [chats, setChats] = useState<ChatsCollection | []>([]);
  const [selectedChat, setSelectedChat] = useState<ChatInfo | null>(null);
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
    return () => disconnect();
  }, []);

  useEffect(() => {
    (async () => {
      if (userData) {
        const channels = await getChannelsByUid(userData?.uid as string);
        setChats(Object.values(channels));
      }
    })();
    console.log('changed')
  }, []);

  useEffect(() => {
    setSelectedChat((selectedChatProp: ChatInfo | null) => {
      return chats && !selectedChatProp
        ? chats[0]
        : selectedChatProp;
    });
  }, [selectedChat]);
  if (chats) console.log('I am defined')
  return (
    <HStack h={`calc(100vh - 60px)`} overflowY={'hidden'}>
      {chats.length
        ? (
          <>
            <VStack
              h="100%"
              w="24vw"
              overflowX={"hidden"}
              p={1}
            >
              {chats
                ? chats.map((chat) => (
                  <ChatCard
                    key={chat.chatId}
                    isActive={selectedChat?.chatId === chat.chatId}
                    name={chat.name}
                    participants={Object.keys(chat.participants)}
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
                chat={selectedChat}
              />
            )}
          </>
        )
        : (
          <Flex
            h="100%"
            w="20vw"
            color="black.500"
            borderRight="1px solid black"
            fontStyle={"italic"}
            flexDir="column"
          >
            <Text
              mx="auto"
              fontSize={"30px"}
            >
              No chats. Please select a user to chat!
            </Text>
          </Flex>
        )}
    </HStack>
  );
};
