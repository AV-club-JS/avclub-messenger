"use strict";

import { Avatar, Flex, Text } from "@chakra-ui/react";
import { DefaultUserData, MessageInfo } from "../../types/types";
import { useContext, useEffect, useState } from "react";
import { getUserByUid } from "../../services";
import { UserContext } from "../../context/AuthContext";
export const MessageComponent = (
  { message }: { message: MessageInfo },
): JSX.Element => {
  const [user, setUser] = useState<DefaultUserData | null>(null);
  const { userData } = useContext(UserContext);
  useEffect(() => {
    (async () => {
      const data = await getUserByUid(message.uid);
      setUser(data.val());
    })();
  }, []);
  return (
    <Flex
      sx={user?.uid === userData?.uid
        ? { justifyContent: "end" }
        : { justifyContent: "start" }}
      key={message.uid}
      w="100%"
    >
      <Avatar name={user?.username} src={user?.avatarUrl} />
      <Text>{message?.content}</Text>
      <Text>{new Date(message?.createdOn).toDateString()}</Text>
    </Flex>
  );
};
