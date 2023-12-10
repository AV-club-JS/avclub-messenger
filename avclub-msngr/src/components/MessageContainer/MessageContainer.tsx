import { Flex } from "@chakra-ui/react";
import { ChildrenProps } from "../../types/types";

export const MessageContainer = ({ children }: ChildrenProps) => {
  return (
    <Flex
      px={3}
      overflowY={"scroll"}
      flexDir={"column"}
      gap={"2"}
      borderLeft={"1px solid"}
      borderColor={"gray.100"}
      height={"100vh"}
    >
      {children}
    </Flex>
  );
};
