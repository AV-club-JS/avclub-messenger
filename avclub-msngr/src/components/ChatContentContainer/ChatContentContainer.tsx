"use strict";
import { FaImages } from "react-icons/fa";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import { ChatInfo, DefaultUserData, MessageInfo } from "../../types/types";
import { MessageContainer } from "../MessageContainer";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  getChatMessages,
  getUsersByUIDs,
  setMessagesListener,
  updateChatInfo,
  addMessageToChatNew,
  uploadChatImage,
} from "../../services";
import { NoMessages } from "../NoMessages";
import { Unsubscribe } from "firebase/auth";
import { UserContext } from "../../context/AuthContext";
import { AdditionalSettingsBar } from "../AdditionalSettingsBar";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/js/plugins.pkgd.min.js";
import FroalaEditorComponent from "react-froala-wysiwyg";
import { froalaMessageConfig } from "../../utils/profileUtils";
import { Messages } from "../Messages";
import { Loading } from "../Loading";
import { useParams } from "react-router-dom";
import { getChatInfoListener } from "../../services";
import { IoMdSend } from "react-icons/io";
import { LoadGIFs } from "../LoadGIFs";
export const ChatContentContainer = () => {
  const { chatId: chatIdUrl } = useParams();
  const [chat, setChat] = useState<ChatInfo>({});
  const { userData } = useContext(UserContext);
  const [messages, setMessages] = useState<MessageInfo[] | null>(null);
  const [participants, setParticipants] = useState<DefaultUserData[]>([]);
  const [insertedMessage, setInsertedMessage] = useState<string>("");
  const [name, setName] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleInputClick = () => {
    inputRef?.current.click();
  };

  const handleImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      const url = await uploadChatImage(file);
      const req = await addMessageToChat({
        chatId: chatIdUrl,
        uid: userData.uid,
        content: `<div class='image-container'><img src=${url}/></div>`,
        type: "image",
      });
      if (!req.success) console.log(req.error);
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  useEffect(() => {
    const onUnmount = getChatInfoListener(chatIdUrl, setChat);
    return () => {
      return onUnmount();
    };
  }, [chatIdUrl]);

  useEffect(() => {
    (async () => {
      if (chat.participants) {
        const users = await getUsersByUIDs(Object.keys(chat.participants));
        setParticipants(users);
        setName(
          chat.name ||
            participants
              .filter((participant) => participant?.uid !== userData?.uid)
              .map((participant) => participant.username)
              .join(","),
        );
        const req = await getChatMessages(chat?.chatId as string);
        const __messages: MessageInfo[] = req.messages as MessageInfo[];
        setMessages(__messages);
      }
    })();
  }, [chat]);

  useEffect(() => {
    let disconnect: Unsubscribe;
    try {
      disconnect = setMessagesListener(chat.chatId as string, setMessages);
    } catch (error) {
      console.log((error as Error).message);
    }
    return () => {
      return disconnect();
    };
  }, []);

  const handleMessage = async () => {
    setInsertedMessage("");

    await addMessageToChatNew({
      chatId: chat.chatId as string,
      uid: userData!.uid as string,
      content: insertedMessage
    });

    await updateChatInfo(chat.chatId!, userData!.uid);
  };

  return (
    <Flex
      flexDir={"column"}
      w={"90%"}
      maxW={"100%"}
      h="100%"
      p={2}
      mb={1}
      overflowX={"hidden"}
    >
      <AdditionalSettingsBar
        participants={participants}
        name={name}
        chatId={chat.chatId as string}
        roomId={chat.roomId as string}
      />
      {messages == null ? <Loading /> : (
        <MessageContainer>
          <>
            {messages.length !== 0
              ? (
                <Messages
                  chatId={chat.chatId as string}
                  messages={messages}
                />
              )
              : <NoMessages />}
          </>
        </MessageContainer>
      )}
      <Flex
        flex={"1 1 20%"}
      >
        <Box m={1} w="85%">
          <FroalaEditorComponent
            model={insertedMessage}
            onModelChange={(e: string) => setInsertedMessage(e)}
            config={froalaMessageConfig}
          />
        </Box>
        <ButtonGroup
          display={"flex"}
          flexDir={"column"}
        >
          <IconButton
            aria-label="Send"
            icon={<IoMdSend />}
            m={2}
            size="lg"
            w={"50px"}
            fontSize="30px"
            color={"brand.accent"}
            variant={"outline"}
            _hover={{
              bg: "brand.primary",
              color: "brand.accent",
            }}
            onClick={handleMessage}
          />
          <Button
            fontSize={"15px"}
            size={"lg"}
            width={"50px"}
            bgColor={"brand.accent"}
            _hover={{
              bgColor: "brand.primary",
              color: "white",
            }}
            onClick={onOpen}
          >
            GIF
          </Button>
          <IconButton
            aria-label="Icon"
            icon={<FaImages />}
            m={2}
            size="lg"
            w={"50px"}
            fontSize="30px"
            color={"brand.accent"}
            variant={"outline"}
            _hover={{
              bg: "brand.primary",
              color: "brand.accent",
            }}
            onClick={handleInputClick}
          />
        </ButtonGroup>
        <LoadGIFs
          isOpen={isOpen}
          onClose={onClose}
          chatId={chat.chatId}
          uid={userData.uid}
        />
        <Input
          ref={inputRef}
          type="file"
          accept=".jpeg,.jpg,.png"
          onChange={handleImage}
          display="none"
        />
      </Flex>
    </Flex>
  );
};
