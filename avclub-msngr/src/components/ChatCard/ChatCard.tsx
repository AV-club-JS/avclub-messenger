"use strict";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Text,
} from "@chakra-ui/react";
import { DefaultUserData } from "../../types/types";
import { ChatHeader } from "../ChatHeader";
export const ChatCard = (
  { name, participants, lastMessage }: {
    name: string;
    participants: DefaultUserData[] | [];
    lastMessage: string;
  },
) => {
  return (
    <Card>
      <CardHeader>
        <ChatHeader name={name} participants={participants}/>
      </CardHeader>
      <CardBody>
        <Text>{lastMessage}</Text>
      </CardBody>
      <CardFooter />
    </Card>
  );
};
