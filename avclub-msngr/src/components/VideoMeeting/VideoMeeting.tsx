import { Box, Text } from "@chakra-ui/react";
import { DyteMeeting } from "@dytesdk/react-ui-kit";
import { useDyteMeeting } from "@dytesdk/react-web-core";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const VideoMeeting = () => {
    const { meeting } = useDyteMeeting();
    const navigate = useNavigate();

    useEffect(() => {
        meeting.self.on('roomLeft', () => {
            navigate(-1);
        })        
    }, [meeting])


    return (
        <Box h={`calc(100vh - 60px)`}>
            {meeting && 
            <DyteMeeting 
            mode="fill" 
            meeting={meeting} 
            showSetupScreen={false}
            />}
            {!meeting && <Text>Loading....</Text>}
        </Box>
    );
}