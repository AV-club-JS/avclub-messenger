import { SearchResultsProps } from "../../../types/types";
import { VStack, HStack, Avatar, AvatarBadge, Text, Divider } from "@chakra-ui/react";
import { getStatusBadgeColor } from "../../../utils/profileUtils";


export const SearchResults = ({ users }: SearchResultsProps) => {

    return (
        <VStack alignItems={'flex-start'} mt={3}>
            {users.length && users.map(user => (
                <HStack key={user.uid} p={1}>
                    <Avatar size="md" src={user.avatarUrl} mr={2}>
                        <AvatarBadge boxSize="1em" bg={getStatusBadgeColor(user.status)} />
                    </Avatar>
                    <VStack>
                        <Text fontSize={'sm'}>{user.username}</Text>
                        <Divider/>
                        <Text fontSize={'sm'}>{user.email}</Text>
                        <Divider/>
                    </VStack>
                </HStack>
            ))}
        </VStack>
    )
}