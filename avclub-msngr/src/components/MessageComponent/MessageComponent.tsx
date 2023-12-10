"use strict";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { MdDelete, MdDns } from "react-icons/md";
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { DefaultUserData, MessageInfo } from "../../types/types";
import { useContext, useEffect, useState } from "react";
import { getUserByUid } from "../../services";
import { UserContext } from "../../context/AuthContext";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/js/plugins.pkgd.min.js";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
import { froalaBioConfig } from "../../utils/profileUtils";
import { emojiList } from "../../constants/emojiList";
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
  const handleReaction = (reaction: string) => {
    console.log(
      message.uid,
      `the reaction of user ${userData?.uid} on the message ${message.messageId} of user ${message.uid} is ${reaction}`,
    );
  };
  return (
    <Popover trigger="hover">
      <PopoverTrigger>
        <Card
          p="0"
          alignSelf={message.uid === userData?.uid ? "flex-end" : "flex-start"}
          maxW="md"
          mb={2}
          border={"1px solid"}
          borderColor={"brand.accent"}
          bgColor={"gray.50"}
        >
          <CardHeader py={2}>
            <Flex>
              <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                <Avatar name={user?.username} src={user?.avatarUrl} />

                <Box>
                  <Heading size="sm">{user?.username}</Heading>
                  <Text
                    fontStyle={"italic"}
                    color={"grey"}
                    fontSize={"smaller"}
                  >
                    {new Date(message.createdOn).toDateString()}
                  </Text>
                </Box>
              </Flex>
            </Flex>
          </CardHeader>
          <CardBody py={1}>
            <FroalaEditorView model={message.content} />
          </CardBody>
          <CardFooter
            py={1}
            justify="space-between"
            flexWrap="wrap"
            sx={{
              "& > button": {
                minH: "12px",
              },
            }}
          >
          </CardFooter>
        </Card>
      </PopoverTrigger>
      <PopoverContent bgColor={"gray.500"}>
        <PopoverArrow />
        <PopoverBody display="flex" flexDir={"column"}>
          <ButtonGroup m='0'>
            <Button
              onClick={() => handleReaction(emojiList.ThumbsUp)}
            >
              {emojiList.ThumbsUp}
            </Button>
            <Button
              onClick={() => handleReaction(emojiList.ThumbsDown)}
            >
              {emojiList.ThumbsDown}
            </Button>
            <Button
              onClick={() => handleReaction(emojiList.Heart)}
            >
              {emojiList.Heart}
            </Button>
            <Button
              onClick={() => handleReaction(emojiList.Smile)}
            >
              {emojiList.Smile}
            </Button>
            <Button
              onClick={() => handleReaction(emojiList.Surprice)}
            >
              {emojiList.Surprice}
            </Button>
            {message.uid === (userData as DefaultUserData).uid &&
              (
                <Button
                  aria-label="delete"
                  onClick={() => handleReaction('delete')}
                  _hover={{ color: "red" }}
                >
                  <MdDelete fontSize='40'/>
                </Button>
              )}
          </ButtonGroup>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
