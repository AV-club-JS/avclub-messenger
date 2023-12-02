import {
  Button,
  Flex,
  HStack,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ChatCardsContainer } from "../../components/ChatCardsContainer";
import { ChatsCollection, DefaultUserData } from "../../types/types";
import { ChatContentContainer } from "../../components/ChatContentContainer";
import { getLastChat, getLastChatMessage } from "../../utils/dataPreparation";
import { UserContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { createChat, getChatInfo, getUsers } from "../../services";
export const Chats = () => {
  const { user, userData, setAuth } = useContext(UserContext);

  let chats: ChatsCollection | null;
  chats = null;
  const selectUser = async () => {
    const users = await getUsers();
  };
  return (
    <HStack h="100vh">
      {chats
        ? (
          <>
            <ChatCardsContainer chats={chats as ChatsCollection} />
            <ChatContentContainer
              chat={getLastChat(chats as ChatsCollection)}
            />
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
              No chats yet
            </Text>
            <Button
              onClick={selectUser}
            >
              Create new chat
            </Button>
          </Flex>
        )}
    </HStack>
  );
};
