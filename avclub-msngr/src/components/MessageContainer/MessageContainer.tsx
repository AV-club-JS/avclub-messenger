import { Flex } from "@chakra-ui/react";
import { ChildrenProps } from "../../types/types";

export const MessageContainer = ({ children }: ChildrenProps) => (
  <Flex
    overflow={'scroll'}
    flexDir={'column'}
    gap={'2'}
  >
    {children}
  </Flex>
);
