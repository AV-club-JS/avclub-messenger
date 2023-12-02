"use strict";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { AvatarGroupComponent } from "../AvatarGroupComponent";
import { DefaultUserData } from "../../types/types";
export const ChatHeader = (
  { name, participants }: { name: string; participants: DefaultUserData[] },
) => {
  return (
    <Flex>
      <Flex flex={1} gap={4} alignItems={"center"} flexWrap={"wrap"}>
        <AvatarGroupComponent max={2} users={participants} />
        <Box>
          <Heading size="sm">{name}</Heading>
        </Box>
      </Flex>
    </Flex>
  );
};
