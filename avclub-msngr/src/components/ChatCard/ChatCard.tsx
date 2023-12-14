import { Card, CardBody, CardFooter, CardHeader, Text } from "@chakra-ui/react";
import { DefaultUserData } from "../../types/types";
import { ChatHeader } from "../ChatHeader";
import { UserContext } from "../../context/AuthContext";
import {
  useContext,
  useEffect,
  useState,
} from "react";
import { getUsersByUIDs } from "../../services";

export const ChatCard = (
  { name, participants, data, lastMessage, isActive, onClick }: {
    name: string;
    participants: number[] | [];
    data: { [uid: string]: { unread: number; received: number; sent: number }};
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
  }, [participants]);

  const chatParticipants = participantsData.filter((
    participant: DefaultUserData,
  ) => participant.uid !== userData?.uid);

  const chatName = chatParticipants
    .map((participant: DefaultUserData) => participant.username)
    .join(", ");

  return (
    <Card
      w="100%"
      bgColor={isActive ? "brand.accent" : ""}
      maxH="100px"
      borderBottom={"1px solid"}
      borderColor="brand.primary"
      _hover={{
        bg: "brand.primary",
        color: "brand.accent",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <CardHeader p="2px 5px">
        <ChatHeader
          isActive={isActive!}
          unreadMessages={data[userData!.uid].unread}
          name={chatName}
          participants={chatParticipants}
        />
      </CardHeader>
      <CardBody
        p={"1px 2px"}
        fontSize={"5px"}
        flexWrap={"wrap"}
        textAlign={"center"}
        textOverflow={"ellipsis"}
        overflow={"hidden"}
      >
        <Text
          w={"100%"}
          fontSize="sm"
          color="gray.500"
          dangerouslySetInnerHTML={{ __html: lastMessage! }}
        >
        </Text>
      </CardBody>
      <CardFooter />
    </Card>
  );
};
