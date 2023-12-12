import { Box } from "@chakra-ui/react";
import { DefaultUserData, MessageInfo } from "../../types/types";
import { MessageComponent } from "../MessageComponent";
import { NoMessages } from "../NoMessages";
import { useEffect, useRef } from "react";
export const Messages = (
  { messages, chatId }: {
    messages: MessageInfo[] | [];
    chatId: string;
  },
): JSX.Element => {
  const BottomRef = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    BottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);
  return (
    <>
      {messages.map((data: MessageInfo, index: number) => (
        <MessageComponent 
          key={data.messageId} 
          chatId={chatId} 
          showAvatar={data.uid !== messages[index - 1]?.uid}
          showTimestamp={data.createdOn - (messages[index - 1]?.createdOn || 0) > 60000}
          message={data} 
        />
      ))}
      <Box ref={BottomRef}></Box>
    </>
  );
};