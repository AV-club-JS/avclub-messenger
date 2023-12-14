"use strict";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { AvatarGroupComponent } from "../AvatarGroupComponent";
import { DefaultUserData } from "../../types/types";
export const ChatHeader = (
  { name, participants, isActive, unreadMessages }: {
    name: string;
    participants: DefaultUserData[];
    isActive: boolean;
    unreadMessages: number;
  },
) => {
  return (
    <Flex>
      <Flex
        flex={1}
        gap={4}
        alignItems={"center"}
        flexWrap={"wrap"}
      >
        <AvatarGroupComponent max={2} users={participants} />
        <Box>
          <Heading
            maxW="150px"
            fontSize={"12px"}
            size={"xs"}
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
          >
            {name}
          </Heading>
        </Box>
        {(!isActive && (unreadMessages)) ? (
          <Box
            py={"1px"}
            px={"5px"}
            color={"white"}
            fontWeight={"bold"}
            fontSize={"sm"}
            borderRadius={"6px"}
            border={"2px solid orange"}
            bgColor="brand.primary"
            textAlign={"center"}
          >
            {unreadMessages && (
              <Text>
                {unreadMessages}
              </Text>
            )}
          </Box>
        ): null}
      </Flex>
    </Flex>
  );
};
