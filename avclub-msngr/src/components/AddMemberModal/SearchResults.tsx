import { DefaultUserData } from "../../types/types";
import { VStack, HStack, Avatar, AvatarBadge, Text, Divider, Button } from "@chakra-ui/react";
import { getStatusBadgeColor } from "../../utils/profileUtils";
import { addUserToTeam, addUserToTeamChannel, getTeamInfo } from "../../services";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/AuthContext";


export const SearchResults = ({ users, currentTeamId, channelAdd = false, channelId }:
    { users: DefaultUserData[], currentTeamId: string, channelAdd: boolean, channelId?: string }) => {
    const { userData } = useContext(UserContext);

    const handleClick = async (userId: string, teamId: string) => {

        try {
            if (channelAdd) {
                await addUserToTeamChannel(userId, channelId!);
            } else {
                await addUserToTeam(userId, teamId);
                const team = await getTeamInfo(currentTeamId);
                
                for (const channel in team.channelIds) {
                    await addUserToTeamChannel(userId, channel);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    if (users.length > 0) {
        return (
            <VStack alignItems={'flex-start'} mt={3}>
                {users.length && users.map(user => (
                    user.uid !== userData!.uid &&
                    <HStack key={user.uid} p={1}>
                        <Link to={`/profile/${user.uid}`}>
                            <Avatar size="md" src={user.avatarUrl} mr={2}>
                                <AvatarBadge boxSize="1em" bg={getStatusBadgeColor(user.status)} />
                            </Avatar>
                        </Link>
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
