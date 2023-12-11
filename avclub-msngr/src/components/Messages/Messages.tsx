import { Box } from '@chakra-ui/react'
import { DefaultUserData, MessageInfo } from "../../types/types";
import { MessageComponent } from '../MessageComponent';
import { NoMessages } from "../NoMessages";
import { useEffect, useRef } from 'react';
export const Messages = ({ messages, user }: { messages: MessageInfo[] | [], user: DefaultUserData }): JSX.Element => {
  const BottomRef = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    BottomRef.current?.scrollIntoView({ behavior: 'auto' })
  }, [messages])

  return (
    <>
      {
        messages.map((data: MessageInfo) => (
          <MessageComponent key={data.messageId} message={data} />
        ))
      }
      <Box ref={BottomRef}></Box>
    </>
  );
};