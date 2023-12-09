import { ChatsCollection } from "../../types/types";
import { HStack, VStack, Button, Text } from "@chakra-ui/react";
import { FC, useContext } from "react";
import { deleteTeamChannel } from "../../services";
import { UserContext } from "../../context/AuthContext";

export const ChannelList: FC<{ channelArr: ChatsCollection }> = ({ channelArr }) => {
    const { userData } = useContext(UserContext);

    const handleDelete = async (teamId: string, channelId: string) => {
        try {
            await deleteTeamChannel(teamId, channelId);

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <VStack alignItems={'flex-start'} mt={3}
            minH='300px' w='auto' overflow={'auto'} direction='column'>
            {channelArr !== null && channelArr.map(channel => (
                <HStack key={channel.chatId}>
                    <Text
                        key={channel.chatId}
                        fontSize={20}
                        fontWeight={600}>{channel.name}</Text>
                    {channel.uid === userData!.uid &&
                        <Button size='sm' ml={4}
                            minW="fit-content" maxW="fit-content"
                            onClick={() => handleDelete(channel.affiliatedTeam!, channel.chatId!)}
                            color={'red.400'}
                            variant={'outline'}
                            _hover={{
                                bg: 'red.400',
                                color: 'brand.primary',
                            }}>Delete</Button>
                    }
                </HStack>
            ))}
            {channelArr?.length === 0 && <Text>No channels to display</Text>}
        </VStack>
    );

};