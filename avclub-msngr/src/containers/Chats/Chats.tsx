import { HStack } from "@chakra-ui/react";
import { ChatsCollection } from "../../types/types";
import { UserContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { getChannelsByUID, getChannelsByUid } from "../../services";
import { Unsubscribe } from "firebase/auth";
import { ChatsComponent } from "../../components/ChatsComponent";

export const Chats = () => {
  const { userData, setAuth } = useContext(UserContext);
  const [chats, setChats] = useState<ChatsCollection | []>([]);
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
    return () => disconnect();
  }, []);

  useEffect(() => {
    (async () => {
      const channels = await getChannelsByUid(userData?.uid as string);
      console.log(userData?.uid, Object.values(channels))
      setChats(channels);
    })();
  }, [userData]);

    return (
    <HStack h={`calc(100vh - 60px)`} overflowY={"hidden"}>
      {chats.length && <ChatsComponent chats={chats}/>}
    </HStack>
  );
};
