import { ChatInfo } from "../../types/types";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { ChatCard } from "../ChatCard";
import { ChatContentContainer } from "../ChatContentContainer";
import { useEffect, useState } from "react";
import { getLastChatMessage } from "../../utils/dataPreparation";
export const ChatsComponent = ({ chats }: { chats: ChatInfo[] }) => {
  const [selectedChat, setSelectedChat] = useState<ChatInfo | null>(null);
  useEffect(() => {
    setSelectedChat((selectedChatProp: ChatInfo | null) => {
      return chats && !selectedChatProp ? chats[0] : selectedChatProp;
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
  );
};
