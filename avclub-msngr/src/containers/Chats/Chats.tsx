import { HStack } from "@chakra-ui/react";
import { ChatsCollection, DefaultUserData } from "../../types/types";
import { UserContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { getChannelsByUID, getChannelsByUid } from "../../services";
import { Unsubscribe } from "firebase/auth";
import { ChatsComponent } from "../../components/ChatsComponent";
import { NoMessages } from "../../components/NoMessages";
import { NoChats } from "../../components/NoChats";
export const Chats = () => {
  const { userData, setAuth } = useContext(UserContext);
  const [chats, setChats] = useState<ChatsCollection | []>([]);
  useEffect(() => {
    (async () => {
      if (userData) {
        const channels = await getChannelsByUid(userData?.uid as string);
        setChats([...channels]);
      }
    })();
  }, [userData]);

  if (chats.length !== 0) {
    return (
      <HStack h={`calc(100vh - 60px)`} overflowY={"hidden"}>
        <ChatsComponent userData={userData as DefaultUserData} setChats={setChats} chats={chats} />
      </HStack>
    );
  } else {
    return (
      <NoChats/>
    )
  }

};
