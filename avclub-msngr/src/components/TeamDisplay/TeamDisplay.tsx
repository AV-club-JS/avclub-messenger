import { ChatInfo, DefaultTeamData } from "../../types/types"
import {
    Text,
    Link,
    AccordionItem,
    AccordionButton,
    Box,
    AccordionIcon,
    AccordionPanel,
    VStack,
    HStack,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { listenTeamChannels } from "../../services";
import { UserContext } from "../../context/AuthContext";
import { Unsubscribe } from "firebase/database";

export const TeamDisplay = ({ team }: { team: DefaultTeamData }) => {
    const { userData } = useContext(UserContext);
    const [channels, setChannels] = useState<ChatInfo[] | null>(null);

    useEffect(() => {
        let disconnect: Unsubscribe;

        if (team && team.channelIds) {
            disconnect = listenTeamChannels(team.teamId, setChannels);
        } else if (!team.channelIds) {
            setChannels([]);
        }
        return () => {
            console.log('wow!');

            if (team && team.channelIds) disconnect();
        }
    }, [])

    if (channels) {
        return (
            <AccordionItem>
                <HStack as='span'>
                    <AccordionButton>
                        <Box as="span" flex='1' textAlign='left'>
                            <Link minW="fit-content" maxW="fit-content"
                                as={NavLink}
                                to={`team/${team.teamId}`}
                                _activeLink={{ color: "brand.accent" }}>
                                <Text fontWeight={600}>{team.name}</Text>
                            </Link>
                        </Box>
                        <AccordionIcon boxSize={7}
                            borderRadius={'lg'}
                            _hover={{
                                bg: 'brand.primary',
                                color: 'brand.accent',
                            }} />
                    </AccordionButton>
                    <Box as="span" flex="1" />
                </HStack>
                <AccordionPanel pb={4}>
                    <VStack align='left' gap={1}>
                        {team.channelIds ? channels.map(channel => (
                            (!channel.personal ||
                                (channel.personal && (Object.prototype.hasOwnProperty.call(channel.participants, userData!.uid)))) &&
                            <Link pl={2} key={channel.chatId}
                                as={NavLink}
                                to={`channel/${channel.chatId}`}
                                bgColor='gray.100'
                                borderRadius='lg'
                                fontWeight={600} fontSize='md'
                                color='brand.primary'>
                                <HStack>
                                    <Text fontWeight={600}>{channel.name}</Text>
                                    {channel.participants[userData!.uid].unread}
                                    <Text>100</Text>
                                </HStack>
                            </Link>
                        )) : <Text ml={.5} fontWeight={600} fontSize='md' color='gray.600'>No channels to display</Text>}
                    </VStack>
                </AccordionPanel>
            </AccordionItem>
        )
    }
}