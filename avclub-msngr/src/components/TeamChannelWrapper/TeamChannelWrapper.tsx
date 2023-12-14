import { Text, Box } from "@chakra-ui/react";
import { ChatContentContainer } from "../ChatContentContainer";
import { useState, useEffect, useContext } from "react";
import { ChatInfo, FetchDataResponse } from "../../types/types";
import { getChatInfo, clearReadMessages } from "../../services";
import { useParams } from "react-router-dom";
import { UserContext } from "../../context/AuthContext";

export const TeamChannelWrapper = () => {
    const { chatId: urlChatId } = useParams();
    const { userData } = useContext(UserContext);
    const [chatInfo, setChatInfo] = useState<ChatInfo | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const data: FetchDataResponse = await getChatInfo(urlChatId!);
                await clearReadMessages(urlChatId!, userData!.uid);
                setChatInfo(data.chatInfo || null);
            } catch (error) {
                console.error(error);
            }
            
        })()
    }, [urlChatId])


    if (chatInfo) {
        return (
            <Box h={`calc(100vh - 60px)`}>
                <ChatContentContainer isChannel={true}/>
            </Box>
        )
    }
}