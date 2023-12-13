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
import { DisplayReactions } from "../DisplayReactions";
import { useContext, useEffect, useState } from "react";
import {
  addReactionToChat,
  getUserByUid,
  removeMessageFromChat,
} from "../../services";
import { UserContext } from "../../context/AuthContext";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/js/plugins.pkgd.min.js";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
import { froalaBioConfig } from "../../utils/profileUtils";
import { emojiList } from "../../constants/emojiList";
import {
  formatTimestamp,
  formatTimestampWithTime,
} from "../../utils/formatTimestamp";
import { Link } from "react-router-dom";
export const MessageComponent = (
  { message, chatId, showAvatar, showTimestamp }: {
    message: MessageInfo;
    chatId: string;
    showAvatar: boolean;
    showTimestamp: boolean;
  },
): JSX.Element => {
  const [user, setUser] = useState<DefaultUserData | null>(null);
  const { userData } = useContext(UserContext);
  useEffect(() => {
    (async () => {
      const data = await getUserByUid(message.uid);
      setUser(data.val());
    })();
  }, []);
  const handleReaction = async (reaction: string) => {
    console.log(
      message.uid,
      `the reaction of user ${userData?.uid} on the message ${message.messageId} of user ${message.uid} is ${reaction}`,
    );
    if (reaction === "delete") {
      await removeMessageFromChat(chatId, message.messageId);
    } else {
      addReactionToChat(
        reaction,
        chatId,
        message.messageId,
        userData?.uid as string,
      );
    }
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
                {showAvatar && (
                  <>
                    <Link to={`/profile/${user?.uid}`}>
                      <Avatar name={user?.username} src={user?.avatarUrl} />
                    </Link>

                    <Box>
                      <Heading size="sm">{user?.username}</Heading>
                    </Box>
                  </>
                )}
              </Flex>
            </Flex>
          </CardHeader>
          <CardBody
            py={1}
            my={0}
          >
            <FroalaEditorView model={message.content} />
          </CardBody>
          <CardFooter
            py={1}
            display={'flex'}
            flexDir={'column'}
            flexWrap="wrap"
            sx={{
              "& > button": {
                minH: "12px",
              },
            }}
          >
            {message.reactions && (
              <DisplayReactions
                chatId={chatId}
                messageId={message.messageId}
                reactions={message.reactions}
              />
            )}
            {showTimestamp && (
              <Box>
                <Text
                  fontStyle={"italic"}
                  color={"grey"}
                  fontSize={"smaller"}
                >
                  {formatTimestampWithTime(message.createdOn)}
                </Text>
              </Box>
            )}
          </CardFooter>
        </Card>
      </PopoverTrigger>
      <PopoverContent bgColor={"gray.500"}>
        <PopoverArrow />
        <PopoverBody display="flex" flexDir={"column"}>
          <ButtonGroup colorScheme="none">
            <Button
              onClick={() => handleReaction(emojiList.ThumbsUp)}
              _hover={{ opacity: 0.7 }}
            >
              {emojiList.ThumbsUp}
            </Button>
            <Button
              onClick={() => handleReaction(emojiList.ThumbsDown)}
              _hover={{ opacity: 0.7 }}
            >
              {emojiList.ThumbsDown}
            </Button>
            <Button
              onClick={() => handleReaction(emojiList.Heart)}
              _hover={{ opacity: 0.7 }}
            >
              {emojiList.Heart}
            </Button>
            <Button
              onClick={() => handleReaction(emojiList.Smile)}
              _hover={{ opacity: 0.7 }}
            >
              {emojiList.Smile}
            </Button>
            <Button
              onClick={() => handleReaction(emojiList.Surprice)}
              _hover={{ opacity: 0.7 }}
            >
              {emojiList.Surprice}
            </Button>
            {message.uid === (userData as DefaultUserData).uid &&
              (
                <Button
                  aria-label="delete"
                  onClick={() => handleReaction("delete")}
                  _hover={{ color: "red", opacity: 0.7 }}
                >
                  <MdDelete fontSize="40" />
                </Button>
              )}
          </ButtonGroup>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
