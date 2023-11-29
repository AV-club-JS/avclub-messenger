"use strict";
import { DefaultUserData } from "../../types/types";
import { ProfileSkeleton } from "./ProfileSkeleton.tsx";
import { getUserByUid } from "../../services/users.services.ts";
import { useEffect, useState } from "react";
import { Avatar, AvatarBadge,Box, HStack, VStack, Text } from "@chakra-ui/react";
export const Profile = () => {
  const [userData, setUserData] = useState<null | DefaultUserData>(null);
  useEffect(() => {
    (async () => {
      const snapshot = await getUserByUid("OvzQMVTy9beQAAWAIjJ0s4Zih3l1");
      setUserData(snapshot.val());
    })();
  });
  return (
    <HStack>
      <VStack 
        bgColor={'rgb(50, 40, 73)'}
        h={'100vh'}
        w={'7vw'}
        pt={5}
        color='wheat'
      >
        
        <VStack>
        <Avatar 
          src={userData?.avatarUrl} 
          name={userData?.username}
          size="xl"
        >
          <AvatarBadge boxSize='0.8em' bg='green.500'/>
        </Avatar>
          <Text>{userData?.username}</Text>
        </VStack>
        <Text>Home</Text>
      </VStack>
      <ProfileSkeleton user={userData as DefaultUserData} />
    </HStack>
  );
};
