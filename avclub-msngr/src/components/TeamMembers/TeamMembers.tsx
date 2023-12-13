import { Avatar, AvatarBadge, HStack, VStack, Text, Divider, Button } from "@chakra-ui/react";
import { UserDataProps } from "../../types/types";
import { getStatusBadgeColor } from "../../utils/profileUtils";
import { removeUserFromTeam } from "../../services";
import { Link } from "react-router-dom";

export const TeamMembers = ({ users, isOwner, teamId }: UserDataProps & { isOwner: boolean; teamId: string }) => {

    const handleKick = async (userId: string) => {
        try {
            await removeUserFromTeam(teamId, userId);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <VStack alignItems={'flex-start'} mt={3} borderRight='1px solid' borderColor='gray.200' h='300px' w='350px' overflow={'auto'}>
            {users.length && users.map(user => (
                <HStack key={user.uid} p={1}>
                    <Link to={`/profile/${user.uid}`}>
                        <Avatar size="md" src={user.avatarUrl} mr={2}>
                            <AvatarBadge boxSize="1em" bg={getStatusBadgeColor(user.status)} />
                        </Avatar>
                    </Link>
                    <VStack alignItems='left'>
                        <Text fontSize='small' fontWeight={600}>{user.username}</Text>
                        <Text fontSize='small'>{user.email}</Text>
                        <Divider />
                    </VStack>
                    {isOwner &&
                        <Button
                            onClick={() => handleKick(user.uid)}
                            size={'sm'}
                            color={'brand.primary'}
                            variant={'outline'}
                            _hover={{
                                bg: 'brand.primary',
                                color: 'brand.accent',
                            }}>
                            Kick
                        </Button>
                    }
                </HStack>
            ))}
        </VStack>
    )
}