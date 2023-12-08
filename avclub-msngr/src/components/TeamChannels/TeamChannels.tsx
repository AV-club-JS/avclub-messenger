import { Button, Stack, Input, Heading } from "@chakra-ui/react";
import { DefaultTeamData, ChatsCollection } from "../../types/types";
import { UserContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { createTeamChannel, getChatInfo } from "../../services";
import { ChannelList } from "../ChannelList";

export const TeamChannels = ({ teamData }: { teamData: DefaultTeamData }) => {
    const { userData } = useContext(UserContext);
    const location = useLocation();
    const [creatingChannel, setCreatingChannel] = useState(false);
    const [channelName, setChannelName] = useState('');
    const [privateStatus, setPrivateStatus] = useState(false);
    const [channels, setChannels] = useState<ChatsCollection | null>(null);

    const handleSave = async () => {
        console.log(channelName);
        const ownerId = userData!.uid;
        const participants = Object.values(teamData.members);

        await createTeamChannel(
            teamData.teamId,
            channelName,
            privateStatus,
            ownerId,
            participants,
        )
        setChannelName('');
        setCreatingChannel(false);
    }

    const handleCancel = () => {
        setChannelName('');
        setCreatingChannel(false);
    }

    useEffect(() => {
        if (teamData && teamData.channelIds) {
            const teamChannels = Object.keys(teamData.channelIds);
            const channelArray = [];
            (async () => {
                for (const channelKey of teamChannels) {
                    try {
                        const chat = await getChatInfo(channelKey);
                        if (chat && chat.chatInfo) {
                            channelArray.push(chat.chatInfo);
                            console.log(channelArray);
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
                setChannels(channelArray);
            })()
        }
    }, [teamData])

    useEffect(() => {
        setCreatingChannel(false);
        setChannels(null);
    }, [location.pathname])

    return (
        <Stack direction='column'>
            <Heading mt={3} as={'h3'} fontWeight={600}>
                Channels:
            </Heading>
            {(teamData.owner === userData!.uid) &&
                (creatingChannel ?
                    <>
                        <Stack direction='row'>
                            <Button size='sm'
                                onClick={handleSave}
                                minW="fit-content" maxW="fit-content"
                                color={'brand.primary'}
                                variant={'outline'}
                                _hover={{
                                    bg: 'brand.primary',
                                    color: 'brand.accent',
                                }}
                            >Save</Button>
                            <Button size='sm'
                                onClick={handleCancel}
                                minW="fit-content" maxW="fit-content"
                                color={'brand.primary'}
                                variant={'outline'}
                                _hover={{
                                    bg: 'brand.primary',
                                    color: 'brand.accent',
                                }}
                            >Cancel</Button>
                        </Stack>
                        <Input
                            w='30%'
                            placeholder="Enter channel name"
                            onChange={e => setChannelName(e.target.value)}
                        />
                    </>
                    : <>
                        <Button size='sm'
                            onClick={() => setCreatingChannel(true)}
                            minW="fit-content" maxW="fit-content"
                            color={'brand.primary'}
                            variant={'outline'}
                            _hover={{
                                bg: 'brand.primary',
                                color: 'brand.accent',
                            }}
                        >Add Channel</Button>
                    </>)}
                    {channels !== null && <ChannelList channelArr={channels} />}
        </Stack>
    )
}