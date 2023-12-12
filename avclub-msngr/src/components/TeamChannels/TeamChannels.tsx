import { Button, Stack, Input, Heading, Checkbox } from "@chakra-ui/react";
import { DefaultTeamData, ChatsCollection } from "../../types/types";
import { UserContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { createTeamChannel, getTeamChannels } from "../../services";
import { ChannelList } from "../ChannelList";
import { dyteRoomCreate, addRoomID } from "../../services";

export const TeamChannels = ({ teamData }: { teamData: DefaultTeamData }) => {
    const { userData } = useContext(UserContext);
    const location = useLocation();
    const [creatingChannel, setCreatingChannel] = useState(false);
    const [channelName, setChannelName] = useState('');
    const [privateStatus, setPrivateStatus] = useState(false);
    const [channels, setChannels] = useState<ChatsCollection | []>([]);

    const handleSave = async () => {
        const ownerId = userData!.uid;
        const participants = { ...teamData.members };

        try {
            const channelId = await createTeamChannel(
                teamData.teamId,
                channelName,
                privateStatus,
                ownerId,
                participants,
            )

            const res = await dyteRoomCreate(channelId);
            const dyteData = await res.json();
            
            await addRoomID(channelId, dyteData.data.id);
        } catch (error) {
            console.error(error);
        }

        setPrivateStatus(false);
        setChannelName('');
        setCreatingChannel(false);
    }

    const handleCancel = () => {
        setPrivateStatus(false);
        setChannelName('');
        setCreatingChannel(false);
    }

    useEffect(() => {
        if (teamData && teamData.channelIds) {
            const teamChannels = Object.keys(teamData.channelIds);
            (async () => {
                try {
                    const chats = await getTeamChannels(teamChannels);
                    setChannels(chats);

                } catch (error) {
                    console.error(error);
                }
            })()
        } else if (!teamData.channelIds) {
            setChannels([]);
        }
    }, [teamData])

    useEffect(() => {
        setCreatingChannel(false);
        setChannels([]);
    }, [location.pathname])

    return (
        <Stack direction='column' mb={5}>
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
                            type="text"
                            w='30%'
                            placeholder="Enter channel name"
                            onChange={e => setChannelName(e.target.value)}
                        />
                        <Checkbox onChange={() => setPrivateStatus(!privateStatus)}>Private</Checkbox>
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
            <ChannelList channelArr={channels} />
        </Stack>
    )
}