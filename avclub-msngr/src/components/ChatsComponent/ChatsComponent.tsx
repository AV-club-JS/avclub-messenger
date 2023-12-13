import { ChatInfo, DefaultUserData } from "../../types/types";
import { Unsubscribe } from "firebase/auth";
import { Box, Text, VStack } from "@chakra-ui/react";
import { ChatCard } from "../ChatCard";
import { ChatContentContainer } from "../ChatContentContainer";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getLastChatMessage } from "../../utils/dataPreparation";
import { getChannelsByUID } from "../../services";
import { Outlet, useNavigate } from "react-router-dom";
export const ChatsComponent = ({ chats, setChats, userData }: {
  chats: ChatInfo[];
  setChats: Dispatch<SetStateAction<ChatInfo[]>>;
  userData: DefaultUserData;
}) => {
  const [activeId, setActiveId] = useState(chats[0].chatId);
  const navigate = useNavigate();
  useEffect(() => {
    let disconnect: Unsubscribe;
    try {
      disconnect = getChannelsByUID(
        userData?.uid as string,
        setChats,
      );
    } catch (error) {
      console.log((error as Error).message);
    }
    return () => {
      return disconnect();
    };
  }, []);
  return (
    <>
      <VStack
        h="100%"
        w="24vw"
        flexDir={"column"}
        overflowX={"hidden"}
        p={1}
      >
        {chats
          ? chats.map((chat) => (
            <ChatCard
              key={chat.chatId}
              isActive={chat.chatId === activeId}
              name={chat.name}
              participants={Object.keys(chat?.participants)}
              lastMessage={getLastChatMessage(chat) as string}
              onClick={() => {
                setActiveId(chat.chatId);
                navigate(`/chats/${chat.chatId}`)
              }}
            />
          ))
          : (
            <Box>
              <Text>
                No chats to display.
              </Text>
            </Box>
          )}
      </VStack>
      <Outlet/>
    </>
  );
};
