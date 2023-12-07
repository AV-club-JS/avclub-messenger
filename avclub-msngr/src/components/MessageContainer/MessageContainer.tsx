import { Flex } from "@chakra-ui/react";
import { ChildrenProps } from "../../types/types";

export const MessageContainer = ({ children }: ChildrenProps) => (
  <Flex
    overflow={'scroll'}
    flex='1 1 60%'
  >
    {children}
  </Flex>
);
