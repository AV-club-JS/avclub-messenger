import { Avatar, AvatarBadge, HStack, VStack, Text, Divider } from "@chakra-ui/react";
import { UserDataProps } from "../../types/types";
import { getStatusBadgeColor } from "../../utils/profileUtils";


export const TeamMembers = ({users}: UserDataProps) => {
    return (
        <VStack alignItems={'flex-start'} mt={3} borderRight='1px solid' borderColor='gray.200' h='300px' w='210px' overflow={'auto'}>
            {users.length && users.map(user => (
                <HStack key={user.uid} p={1}>
                    <Avatar size="md" src={user.avatarUrl} mr={2}>
                        <AvatarBadge boxSize="1em" bg={getStatusBadgeColor(user.status)} />
                    </Avatar>
                    <VStack alignItems='left'>
                        <Text fontSize='small' fontWeight={600}>{user.username}</Text>
                        <Text fontSize='small'>{user.email}</Text>
                        <Divider />
                    </VStack>
                </HStack>
            ))}
        </VStack>
    )
}