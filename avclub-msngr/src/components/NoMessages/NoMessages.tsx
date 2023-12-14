import { Heading, Text, VStack, Icon } from "@chakra-ui/react";
import { FaComments } from "react-icons/fa";

export const NoMessages = () => {
  
  return (
    <VStack spacing={4} align="center" justify="center" height="100vh" width='100%'>
      <Icon as={FaComments} boxSize={10} color="brand.accent" />
      <Heading size="lg" textAlign="center">
        No messages for now.
      </Heading>
      <Text color="gray.400" textAlign="center">
        It seems like you haven't started a chat yet.
      </Text>
    </VStack>
  );
};

