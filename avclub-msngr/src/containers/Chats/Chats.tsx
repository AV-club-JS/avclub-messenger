import { HStack } from "@chakra-ui/react";
import { ChatsCollection, DefaultUserData } from "../../types/types";
import { UserContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { getChannelsByUid } from "../../services";
import { ChatsComponent } from "../../components/ChatsComponent";
import { NoChats } from "../../components/NoChats";
import { Loading } from "../../components/Loading";
export const Chats = () => {
  const { userData } = useContext(UserContext);
  const [chats, setChats] = useState<ChatsCollection | null>(null);
  useEffect(() => {
    (async () => {
      if (userData) {
        const channels = await getChannelsByUid(userData?.uid as string);
        setChats([...channels]);
      }
    })();
  }, [userData]);

  if (userData) {
    if (userData?.chatids) {
      if (chats) {
        return (
          <HStack h={`calc(100vh - 60px)`} overflowY={"hidden"}>
            <ChatsComponent userData={userData as DefaultUserData} setChats={setChats} chats={chats} />
          </HStack>
        );
      } else {
        return (
          <Loading />
        )
      }
    } else {
      return (
        <NoChats />
      )
    }
  }
};
