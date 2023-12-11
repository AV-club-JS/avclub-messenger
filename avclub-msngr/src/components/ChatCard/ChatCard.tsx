"use strict";
import { Card, CardBody, CardFooter, CardHeader, Text } from "@chakra-ui/react";
import { DefaultUserData } from "../../types/types";
import { ChatHeader } from "../ChatHeader";
import { UserContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { getUsersByUIDs } from "../../services";

export const ChatCard = (
  { name, participants, lastMessage, isActive, onClick }: {
    name: string;
    participants: number[] | [];
    lastMessage?: string;
    isActive?: boolean;
    onClick?: () => void;
  },
) => {
  const { userData } = useContext(UserContext);
  const [participantsData, setParticipantsData] = useState<DefaultUserData[]>(
    [],
  );

  useEffect(() => {
    (async () => {
      const users: DefaultUserData[] = await getUsersByUIDs(participants);
      setParticipantsData(users);
    })();
  }, []);

  const chatParticipants = participantsData.filter((
    participant: DefaultUserData,
  ) => participant.uid !== userData?.uid);

  const chatName = chatParticipants
    .map((participant: DefaultUserData) => participant.username)
    .join(" , ");

  return (
    <Card
      w="100%"
      bgColor={isActive ? "brand.accent" : ""}
      maxH="100px"
      borderBottom={"1px solid"}
      borderColor='brand.primary'
      _hover={{
        bg: "brand.primary",
        color: "brand.accent",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <CardHeader>
        <ChatHeader name={chatName} participants={chatParticipants} />
        <CardBody
          flexWrap={"wrap"}
          m="0"
          p="0"
          textAlign={"center"}
          overflow={"hidden"}
        >
          <Text
            w={'100%'}
            fontSize='sm'
            color='gray.500'
            h={18}
            dangerouslySetInnerHTML={{ __html: lastMessage! }}
          >
          </Text>
        </CardBody>
      </CardHeader>
      <CardFooter />
    </Card>
  );
};
