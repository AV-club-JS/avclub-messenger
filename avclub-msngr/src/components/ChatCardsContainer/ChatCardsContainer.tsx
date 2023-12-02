"use strict";
import { VStack } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { UserContext } from '../../context/AuthContext';
import { DefaultUserData, ChatsCollection } from "../../types/types";
import { ChatCard } from "../ChatCard";
import { Box } from '@chakra-ui/react';
export const ChatCardsContainer = (
  { chats }: {chats: ChatsCollection}) => {
  useEffect(() => {
    (async () => {
      //
    })();
  }, []);
  return (
    <VStack>
      {chats ? chats.map((chat) => (
        <ChatCard
          name={chat.name}
          participants={chat.participants}
          lastMessage={chat.content}
        />
      )) : <Box>You still not have any chat. Start a chat with wome of your friends.</Box>}
    </VStack>
  );
};
