import {  DefaultUserData } from "../../types/types";
import { VStack, HStack, Avatar, AvatarBadge, Text, Divider, Button } from "@chakra-ui/react";
import { getStatusBadgeColor } from "../../utils/profileUtils";
import { addUserToTeam } from "../../services";


export const SearchResults = ({ users, currentTeamId }: { users: DefaultUserData[], currentTeamId: string }) => {

    const handleClick = async (userId: string, teamId: string) => {

        try {
            await addUserToTeam(userId, teamId);
        } catch (error) {
            console.error(error);
        }
    }

    if (users.length > 0) {
        return (
            <VStack alignItems={'flex-start'} mt={3}>
                {users.length && users.map(user => (
                    <HStack key={user.uid} p={1}>
                        <Avatar size="md" src={user.avatarUrl} mr={2}>
                            <AvatarBadge boxSize="1em" bg={getStatusBadgeColor(user.status)} />
                        </Avatar>
                        <VStack>
                            <Text fontSize={'sm'}>{user.username}</Text>
                            <Divider />
                            <Text fontSize={'sm'}>{user.email}</Text>
                            <Divider />
                        </VStack>
                        <Button size='sm'
                            onClick={() => handleClick(user.uid, currentTeamId)}
                            color={'brand.primary'}
                            variant={'ghost'}
                            _hover={{
                                bg: 'brand.primary',
                                color: 'brand.accent',
                            }}>+</Button>
                    </HStack>
                ))}
            </VStack>
        )
    }
}
