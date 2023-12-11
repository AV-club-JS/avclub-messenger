"use strict";
import { VStack } from "@chakra-ui/react";
import { ChatsCollection } from "../../types/types";
import { ChatCard } from "../ChatCard";
import { Box, Text } from '@chakra-ui/react';

export const ChatCardsContainer = (
  { chats }: {chats: ChatsCollection}) => {
  return (
    <VStack bgColor='brand.primary'>
      {chats ? chats.map((chat) => (
        <ChatCard
          key={chat.chatId}
          name={chat.name}
          participants={Object.values(chat.participants)}
          lastMessage={'Hello world'}
        />
      )) : <Box><Text>You still don't have any chats.</Text></Box>}
    </VStack>
  );
};
