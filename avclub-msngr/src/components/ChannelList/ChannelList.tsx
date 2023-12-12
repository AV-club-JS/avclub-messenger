import { ChatsCollection } from "../../types/types";
import { HStack, VStack, Button, Text, Menu, MenuButton, MenuList, MenuItem, IconButton, FormControl, useDisclosure } from "@chakra-ui/react";
import { FC, useContext, useState } from "react";
import { deleteTeamChannel } from "../../services";
import { UserContext } from "../../context/AuthContext";
import { TbDotsVertical } from "react-icons/tb";
import { AddMemberModal } from "../AddMemberModal";


export const ChannelList: FC<{ channelArr: ChatsCollection; teamId: string }> = ({ channelArr, teamId }) => {
    const { userData } = useContext(UserContext);
    const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();

    const handleDelete = async (teamId: string, channelId: string) => {
        try {
            await deleteTeamChannel(teamId, channelId);

        } catch (error) {
            console.error(error);
        }
    }

    const handleAddOpen = () => {
        onAddOpen();
    }

    return (
        <VStack alignItems={'flex-start'} mt={3}
            minH='300px' w='auto' overflow={'auto'} direction='column'>
            {channelArr !== null && channelArr.map(channel => (
                (Object.prototype.hasOwnProperty.call(channel.participants, userData!.uid)) &&
                <HStack key={channel.chatId}>
                    <Text
                        key={channel.chatId}
                        fontSize={20}
                        fontWeight={600}>{channel.name}</Text>
                    {channel.uid === userData!.uid &&
                        <Menu isLazy>
                            <MenuButton as={IconButton} icon={<TbDotsVertical />}>
                            </MenuButton>
                            <MenuList>
                                {channel.personal && <MenuItem
                                onClick={handleAddOpen}>Add Members</MenuItem>}
                                <MenuItem>Edit Name</MenuItem>
                                <MenuItem
                                    onClick={() => handleDelete(channel.affiliatedTeam!, channel.chatId!)} color='red.500'
                                >Delete</MenuItem>
                            </MenuList>
                            <AddMemberModal isOpen={isAddOpen} onClose={onAddClose} 
                            teamId={teamId} channelAdd={true} channelId={channel.chatId} />
                        </Menu>
                    }
                </HStack>
            ))}
            {channelArr?.length === 0 && <Text>No channels to display</Text>}
        </VStack>
    );

};