"use strict";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiChat, BiLike, BiShare } from "react-icons/bi";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  Text,
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
    <Card
      p='0'
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
              <Text fontStyle={"italic"} color={"grey"} fontSize={"smaller"}>
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
  );
};
