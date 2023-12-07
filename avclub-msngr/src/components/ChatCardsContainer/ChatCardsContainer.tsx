"use strict";
import { VStack } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { UserContext } from '../../context/AuthContext';
import { DefaultUserData, ChatsCollection } from "../../types/types";
import { ChatCard } from "../ChatCard";
import { Box, Text } from '@chakra-ui/react';

export const ChatCardsContainer = (
  { chats }: {chats: ChatsCollection}) => {
  return (
    <VStack>
      {chats ? chats.map((chat) => (
        <ChatCard
          name={chat.name}
          participants={Object.values(chat.participants)}
          lastMessage={'Hello world'}
        />
      )) : <Box><Text>You still not have any chat. Start a chat with some of your friends.</Text></Box>}
    </VStack>
  );
};
