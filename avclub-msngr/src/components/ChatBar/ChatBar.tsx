"use strict";

import { HStack } from "@chakra-ui/react";
import { ChatHeader } from "../ChatHeader";
import { DefaultUserData } from "../../types/types";
export const ChatBar = ({name, participants}: {name: string, participants: DefaultUserData[]}) => {
  return (
    <HStack h={"10vh"} w={"100%"}>
      <ChatHeader name={name} participants={participants}/>
    </HStack>
  );
};  
