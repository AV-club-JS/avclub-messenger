import { ChatsCollection, DefaultTeamData } from "../../types/types"
import {
    Text,
    Link,
    AccordionItem,
    AccordionButton,
    Box,
    AccordionIcon,
    AccordionPanel,
    VStack
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { getTeamChannels } from "../../services";
import { UserContext } from "../../context/AuthContext";

export const TeamDisplay = ({ team }: { team: DefaultTeamData }) => {
    const { userData } = useContext(UserContext);
    const [channels, setChannels] = useState<ChatsCollection | []>([]);

    useEffect(() => {
        if (team && team.channelIds) {
            const teamChannels = Object.keys(team.channelIds);
            (async () => {
                try {
                    const chats = await getTeamChannels(teamChannels);
                    setChannels(chats);

                } catch (error) {
                    console.error(error);
                }
            })()

        } else if (!team.channelIds) {
            setChannels([]);
        }
    }, [team])

    return (
        <AccordionItem>
            <h2>
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
            </h2>
            <AccordionPanel pb={4}>
                <VStack align='left' gap={1}>
                    {team.channelIds ? channels.map(channel => (
                        (!channel.personal ||
                            (channel.personal && (Object.prototype.hasOwnProperty.call(channel.participants, userData!.uid)))) &&
                        <Link pl={2} key={channel.chatId}
                            as={NavLink}
                            to={`channel/${channel.chatId}`}
                            bgColor='gray.100'
                            fontWeight={600} fontSize='sm'
                            color='brand.primary'>
                            <Text fontWeight={600}>{channel.name}</Text>
                        </Link>
                    )) : <Text ml={.5} fontWeight={600} fontSize='md' color='gray.600'>No channels to display</Text>}
                </VStack>
            </AccordionPanel>
        </AccordionItem>
    )
}