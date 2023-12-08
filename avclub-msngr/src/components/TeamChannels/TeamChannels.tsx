import { Stack, Text } from "@chakra-ui/react";
import { DefaultTeamData } from "../../types/types"; 

export const TeamChannels = ({ teamData }: {teamData: DefaultTeamData}) => {

    return (
        <Stack direction='column'>
            <Text fontWeight={600}>
                Channels:
            </Text>
            <Text></Text>
        </Stack>
    )
}