"use strict";
import {BsThreeDotsVertical} from 'react-icons/bs';
import {BiChat, BiLike, BiShare} from 'react-icons/bi'
import { Box, Button ,Card, CardBody, CardHeader, CardFooter,Avatar, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { DefaultUserData, MessageInfo } from "../../types/types";
import { useContext, useEffect, useState } from "react";
import { getUserByUid } from "../../services";
import { UserContext } from "../../context/AuthContext";
export const MessageComponent = (
  { message }: { message: MessageInfo }
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
    <Card
    alignSelf={message.uid === userData?.uid ? 'flex-end' : 'flex-start'} 
    maxW='md'
    border={'1px solid'}
    borderColor={'black.300'}
    bgColor={'blue.200'}
    >
      <CardHeader >
        <Flex>
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar name={user?.username} src={user?.avatarUrl} />

            <Box>
              <Heading size="sm">{user?.username}</Heading>
              <Text fontStyle={'italic'} color={'grey'}>
                {new Date(message.createdOn).toDateString()}
              </Text>
            </Box>
          </Flex>
          <IconButton
            variant="ghost"
            colorScheme="gray"
            aria-label="See menu"
            icon={<BsThreeDotsVertical />}
          />
        </Flex>
      </CardHeader>
      <CardBody>
        <Text>
          {message.content}
        </Text>
      </CardBody>
      <CardFooter
        justify="space-between"
        flexWrap="wrap"
        sx={{
          "& > button": {
            minH: '12px'
          },
        }}
      >
        <Button flex="1" variant="ghost" leftIcon={<BiLike />}>
          Like
        </Button>
        <Button flex="1" variant="ghost" leftIcon={<BiChat />}>
          Comment
        </Button>
        <Button flex="1" variant="ghost" leftIcon={<BiShare />}>
          Share
        </Button>
      </CardFooter>
    </Card>
  );
};
