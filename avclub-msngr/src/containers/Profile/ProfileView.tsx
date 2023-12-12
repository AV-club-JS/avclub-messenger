import { Avatar, AvatarBadge, Box, Flex, FormControl, FormLabel, Stack, Text } from "@chakra-ui/react";
import { getStatusBadgeColor } from "../../utils/profileUtils";
import { formatTimestamp } from "../../utils/formatTimestamp";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserByUid } from "../../services";
import { DefaultUserData } from "../../types/types";
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins.pkgd.min.js';
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";

export const ProfileView = () => {
    const { userId } = useParams();
    const [user, setUser] = useState<DefaultUserData | null>(null);

    useEffect(() => {
        (async () => {
            const req = await getUserByUid(userId!);
            const data = req.val();
            setUser(data);
        })()
    }, [])

    if (user) {
        return (
            <Flex direction="column" alignItems="center" px={4} mb={12}>
                <Stack direction="row" p={6}>
                    <Avatar size="2xl" src={user!.avatarUrl}>
                        <AvatarBadge boxSize="1em" bg={getStatusBadgeColor(user!.status)} />
                    </Avatar>
                </Stack>
                <Stack direction="row" spacing={4} mt={4}>
                    <Text fontWeight={600}>Email: {user!.email}</Text>
                </Stack>
                <Text fontSize="small">Member Since: {formatTimestamp(user!.createdOn)}</Text>
                <Box mt={8} w="100%" maxW="600px">
                    <Stack direction="row" spacing={4}>
                        <Stack direction="row">
                            <Text fontWeight={600}>Username</Text>
                        </Stack>
                        <Text>{user!.username}</Text>
                    </Stack>
                    <Stack direction="row" spacing={4} mt={4}>
                        <Stack direction="row">
                            <Text fontWeight={600}>First Name</Text>
                        </Stack>
                        <Text>{user!.firstName}</Text>
                        <Stack direction='row'>
                            <Text fontWeight={600}>Last Name</Text>
                        </Stack>
                        <Text>{user!.lastName}</Text>
                    </Stack>
                    <Stack mt={4} direction='row'>
                        <Text fontWeight={600}>Phone Number</Text>
                    </Stack>
                    <Text>{user!.phone}</Text>
                    <Stack direction='row'>
                        <Text mt={8} fontWeight={600}>Bio</Text>
                    </Stack>
                    <FroalaEditorView model={user!.bio} />
                </Box>
            </Flex>
        );
    }
};
