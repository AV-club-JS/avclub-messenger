import { Text, Box } from "@chakra-ui/react";
import { ChatContentContainer } from "../ChatContentContainer";
import { useState, useEffect } from "react";
import { ChatInfo, FetchDataResponse } from "../../types/types";
import { getChatInfo } from "../../services";
import { useParams } from "react-router-dom";

export const TeamChannelWrapper = () => {
    const { chatId: urlChatId } = useParams();
    const [chatInfo, setChatInfo] = useState<ChatInfo | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const data: FetchDataResponse = await getChatInfo(urlChatId!);
                setChatInfo(data.chatInfo || null);
            } catch (error) {
                console.error(error);
            }
            
        })()
    }, [urlChatId])


    if (chatInfo) {
        return (
            <Box h={`calc(100vh - 60px)`}>
                <ChatContentContainer chat={chatInfo} />
            </Box>
        )
    }
}