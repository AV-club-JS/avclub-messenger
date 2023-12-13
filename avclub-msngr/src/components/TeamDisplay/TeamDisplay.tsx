import { ChatsCollection, DefaultTeamData } from "../../types/types"
import {
    Text,
    Link,
    AccordionItem,
    AccordionButton,
    Box,
    AccordionIcon,
    AccordionPanel,
    VStack,
    IconButton,
    HStack,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { getTeamChannels, getTeamInfo } from "../../services";
import { UserContext } from "../../context/AuthContext";
import { RepeatIcon } from "@chakra-ui/icons";

export const TeamDisplay = ({ team }: { team: DefaultTeamData }) => {
    const { userData } = useContext(UserContext);
    const [channels, setChannels] = useState<ChatsCollection | []>([]);

    const onRefresh = async () => {
        
        if (team && team.channelIds) {
            const newTeamInfo = await getTeamInfo(team.teamId);
            const teamChannels = Object.keys(newTeamInfo.channelIds);

            try {
                const chats = await getTeamChannels(teamChannels);                
                setChannels(chats);
            } catch (error) {
                console.error(error);
            }
        } else if (!team.channelIds) {
            setChannels([]);
        }
    }

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
    }, [])

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
                <IconButton
                    aria-label='refresh channels'
                    icon={<RepeatIcon />}
                    isRound={true}
                    variant='ghost'
                    onClick={onRefresh}
                    mr={1}
                    _hover={{
                        bg: 'brand.primary',
                        color: 'brand.accent',
                    }}
                    _active={{
                        bg: 'brand.accent',
                        color: 'brand.primary',
                    }}
                />
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