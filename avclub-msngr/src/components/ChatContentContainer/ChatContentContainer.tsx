"use strict";
import { Stack, VStack } from "@chakra-ui/react";
import { ChatBar } from "../ChatBar";
import { ChatInfo } from "../../types/types";
export const ChatContentContainer = ({ chat }: { chat: ChatInfo }) => {
  return (
    <VStack>
      <ChatBar name={chat.name} participants={chat.participants} />
      <Stack>
        {Array.from(Object.values(chat.messages)).map((message) => (
          <>
            <Box>{message.content}</Box>
            <Box>{message.author}</Box>
          </>
        ))}
      </Stack>
    </VStack>
  );
};
