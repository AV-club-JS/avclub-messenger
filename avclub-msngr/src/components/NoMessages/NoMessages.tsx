'use strict';
import { Box, Heading, Text, VStack, Icon } from "@chakra-ui/react";
import { FaComments } from "react-icons/fa";
import { AiOutlineUserAdd } from "react-icons/ai";

interface NoMessagesProps {
  senderName: string;
  receiverName: string;
}

export const NoMessages: React.FC<NoMessagesProps> = ({ senderName, receiverName }) => {
  
  return (
    <VStack spacing={4} align="center" justify="center" height="100vh" width='100%'>
      <Icon as={FaComments} boxSize={10} color="gray.500" />
      <Heading size="lg" textAlign="center">
        No messages between {receiverName} and {senderName}.
      </Heading>
      <Text color="gray.500" textAlign="center">
        It seems like you haven't started a chat yet.
      </Text>
      <Box textAlign={'center'}>
        <Icon as={AiOutlineUserAdd} boxSize={6} color="blue.500" />
        <Text color="blue.500" textAlign="center">
          Start a chat with {receiverName} now!
        </Text>
      </Box>
    </VStack>
  );
};

