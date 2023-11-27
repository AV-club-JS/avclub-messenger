import { useState, useEffect } from "react";
import { FC } from "react";
// chakra
import { Avatar, AvatarBadge, Box, Button, Flex, FormControl, FormLabel, Input, Select, Stack, Textarea, Text } from "@chakra-ui/react";
// utils
import { getStatusBadgeColor } from "../../utils/profileUtils";
// types
import { DefaultUserData } from "../../types/types";

export const Profile: FC<DefaultUserData> = ({
    username = '',
    email = '',
    firstName ='',
    lastName = '',
    phone = '',
    avatarUrl,
    status = 'offline',
    createdOn,
    bio,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(status);

    useEffect(() => {
        setCurrentStatus(status);
    }, [status])

    const handleStatusChange = (newStatus: string) => {
        setCurrentStatus(newStatus);
        console.log("Status changed:", newStatus);
    };

    return (
        <Flex direction="column" alignItems="center" px={4}>

            <Stack direction="row" p={6}>
                <Avatar size="2xl" src={avatarUrl}>
                    <AvatarBadge boxSize="1.25em" bg={getStatusBadgeColor(currentStatus)} />
                </Avatar>
                <FormControl>
                    <FormLabel>Status</FormLabel>
                    <Select defaultValue={status} onChange={(e) => handleStatusChange(e.target.value)}>
                        <option value="online">Online</option>
                        <option value="away">Away</option>
                        <option value="busy">Busy</option>
                        <option value="in meeting">In Meeting</option>
                        <option value="offline">Offline</option>
                    </Select>
                </FormControl>
            </Stack>
            <Text>Member Since: {createdOn}</Text>
            <Button mt={4} onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Save" : "Edit"}
            </Button>
            <Box mt={8} w="100%" maxW="600px">
                <Stack direction="row" spacing={4}>
                    <FormControl isDisabled={!isEditing}>
                        <FormLabel>Username</FormLabel>
                        <Input defaultValue={username} />
                    </FormControl>
                </Stack>
                <Stack direction="row" spacing={4} mt={4}>
                    <FormControl isDisabled>
                        <FormLabel>Email</FormLabel>
                        <Input defaultValue={email} />
                    </FormControl>
                </Stack>
                <Stack direction="row" spacing={4} mt={4}>
                    <FormControl isDisabled={!isEditing}>
                        <FormLabel>First Name</FormLabel>
                        <Input defaultValue={firstName} />
                    </FormControl>
                    <FormControl isDisabled={!isEditing}>
                        <FormLabel>Last Name</FormLabel>
                        <Input defaultValue={lastName} />
                    </FormControl>
                </Stack>
                <FormControl isDisabled={!isEditing} mt={4}>
                    <FormLabel>Phone Number</FormLabel>
                    <Input defaultValue={phone} />
                </FormControl>
                <FormControl isDisabled={!isEditing} mt={4}>
                    <FormLabel>Bio</FormLabel>
                    <Textarea defaultValue={bio} />
                </FormControl>
            </Box>
        </Flex>
    );
};