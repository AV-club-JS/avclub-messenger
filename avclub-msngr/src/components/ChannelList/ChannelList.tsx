import { ChatsCollection } from "../../types/types";
import { HStack, VStack, Button, Text, Menu, MenuButton, MenuList, MenuItem, IconButton, FormControl, useDisclosure, Spacer } from "@chakra-ui/react";
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
                (!channel.personal ||
                    (channel.personal && (Object.prototype.hasOwnProperty.call(channel.participants, userData!.uid)))) &&
                <HStack key={channel.chatId} >
                    <Text bgColor='gray.100' borderRadius='lg'pl={2}
                        fontSize={20} fontWeight={600} minW="400px" maxW="400px" 
                        overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis"
                        >{channel.name}</Text>
                    {(channel.uid === userData!.uid && channel.name !== 'General') &&
                    <>
                    <Spacer />
                        <Menu isLazy>
                            <MenuButton as={IconButton} icon={<TbDotsVertical />}
                            size='sm'
                            color={'brand.primary'}
                            variant={'outline'}
                            _hover={{
                                bg: 'brand.primary',
                                color: 'brand.accent',
                            }}>
                            </MenuButton>
                            <MenuList>
                                {channel.personal && <MenuItem
                                    onClick={handleAddOpen}>Add Members</MenuItem>}
                                {/* <MenuItem>Edit Name</MenuItem> */}
                                <MenuItem
                                    onClick={() => handleDelete(channel.affiliatedTeam!, channel.chatId!)} color='red.500'
                                >Delete</MenuItem>
                            </MenuList>
                            <AddMemberModal isOpen={isAddOpen} onClose={onAddClose}
                                teamId={teamId} channelAdd={true} channelId={channel.chatId} />
                        </Menu>
                    </>
                    }
                </HStack>
            ))}
            {channelArr?.length === 0 && <Text>No channels to display</Text>}
        </VStack>
    );

};