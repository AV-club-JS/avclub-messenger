import { Flex } from "@chakra-ui/react";
import { ChildrenProps } from "../../types/types";

export const MessageContainer = ({ children }: ChildrenProps) => (
  <Flex
    px={3}
    overflowY={'scroll'}
    flexDir={'column'}
    gap={'2'}
    border={'1px solid'}
    borderColor={'gray.100'}
  >
    {children}
  </Flex>
);
