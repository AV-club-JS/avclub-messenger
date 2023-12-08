import { Text, Flex, Stack, Heading, Divider, Button, FormControl, Center, Input, useDisclosure, FormErrorMessage } from "@chakra-ui/react";
import { useEffect, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../context/AuthContext";
import { DefaultTeamData, DefaultUserData } from "../../types/types";
import {
    listenTeamData, getUserByUid, getUsersByTeam, updateTeamData,
    doesTeamNameExist, deleteTeam, removeUserTeam, removeUserFromTeam
} from "../../services";
import { Unsubscribe } from "firebase/database";
import { formatTimestamp } from "../../utils/formatTimestamp";
import { TeamMembers } from "../TeamMembers";
import { TeamOwnerMenu } from "../TeamOnwerMenu";
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins.pkgd.min.js';
import FroalaEditorComponent from 'react-froala-wysiwyg';
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
import { froalaBioConfig } from "../../utils/profileUtils";
import { AddMemberModal } from "../AddMemberModal";


export const TeamView = () => {
    const { teamId: urlTeamId } = useParams();
    const [teamData, setTeamData] = useState<DefaultTeamData>(null!);
    const [owner, setOwner] = useState('');
    const [members, setMembers] = useState<DefaultUserData[]>([]);
    const { userData } = useContext(UserContext);
    const [isEditingTeamName, setIsEditingTeamName] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [teamInfo, setTeamInfo] = useState('');
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [teamNameInvalid, setTeamNameInvalid] = useState(false);
    const [teamNameError, setTeamNameError] = useState('');
    const { isOpen: isSearchOpen, onOpen: onSearchOpen, onClose: onSearchClose } = useDisclosure();
    const navigate = useNavigate();

    const handleSearchOpen = () => {
        onSearchOpen();
    };

    const handleTeamNameEdit = async () => {

        if (teamName.length < 5) {
            setTeamNameInvalid(true);
            setTeamNameError('Team name must be at least five characters.');
            return;
        }
        try {
            const check = await doesTeamNameExist(teamName);
            if (teamName == teamData.name) {
                setTeamNameInvalid(false);
                setIsEditingTeamName(false);
                return;
            }
            if (check == true) {
                setTeamNameInvalid(true);
                setTeamNameError('This name already exists.');
                return;
            }
            await updateTeamData(teamData.teamId, { name: teamName });
            setTeamNameInvalid(false);
            setIsEditingTeamName(false);
        } catch (error) {
            console.error(error);
        }

    }

    const handleInfoEdit = async () => {
        try {
            await updateTeamData(teamData.teamId, { info: teamInfo });
            setIsEditingInfo(false);
        } catch (error) {
            console.error(error);
        }
    }

    const handleDelete = async () => {
        try {
            await deleteTeam(teamData.teamId);
            await removeUserTeam(userData!.uid, teamData.teamId);
            navigate('/teams');
        } catch (error) {
            console.error(error);
        }
    }

    const handleLeave = async () => {
        try {
            await removeUserFromTeam(teamData.teamId, userData!.uid);
            navigate('/teams');
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (teamData) {
            (async () => {
                try {
                    const req = await getUserByUid(teamData.owner);
                    const ownerData = req.val();

                    setOwner(ownerData.username);
                    const membersData = await getUsersByTeam(teamData.teamId);

                    setMembers(membersData);
                    setTeamName(teamData.name);
                    setTeamInfo(teamData.info);
                } catch (error) {
                    console.error(error);
                }
            })()
        }
    }, [teamData])

    useEffect(() => {
        let disconnectTeamListener: Unsubscribe;

        try {
            disconnectTeamListener = listenTeamData(urlTeamId!, setTeamData);
        } catch (error) {
            console.error(error);

        }

        return () => {
            setIsEditingTeamName(false);
            setIsEditingInfo(false);
            setTeamNameError('');
            disconnectTeamListener();
        }
    }, [urlTeamId])

    if (teamData && owner) {
        return (
            <Stack direction="column" px={4} mt={4} mb={4} overflowY="auto" maxHeight="100vh">
                <Stack direction='column' align='center'>
                    <Stack alignItems='center'>
                        <FormControl isInvalid={teamNameInvalid}>
                            {isEditingTeamName ? (
                                <>
                                    <Input m={1} value={teamName} onChange={(e) => setTeamName(e.target.value)} />
                                    <FormErrorMessage>{teamNameError}</FormErrorMessage>
                                </>
                            ) : (
                                <>
                                    <Heading>{teamData.name}</Heading>
                                    {teamNameInvalid && <FormErrorMessage>{teamNameError}</FormErrorMessage>}
                                </>
                            )}
                            <Center>
                                {userData!.uid === teamData.owner && (isEditingTeamName ? (
                                    <Button size="sm" color={'brand.primary'}
                                        variant={'ghost'}
                                        _hover={{
                                            bg: 'brand.primary',
                                            color: 'brand.accent',
                                        }}
                                        onClick={handleTeamNameEdit}>
                                        Save
                                    </Button>
                                ) : (
                                    <Button size="sm"
                                        color={'brand.primary'}
                                        variant={'ghost'}
                                        _hover={{
                                            bg: 'brand.primary',
                                            color: 'brand.accent',
                                        }}
                                        onClick={() => setIsEditingTeamName(true)}>
                                        Edit
                                    </Button>
                                ))}
                            </Center>
                        </FormControl>
                    </Stack>
                    {userData!.uid !== teamData.owner &&
                        <Stack direction="row" spacing={4} position="absolute" top={'180px'} right={4}>
                            <Button
                                size="sm"
                                color={'brand.primary'}
                                variant={'ghost'}
                                _hover={{
                                    bg: 'brand.primary',
                                    color: 'brand.accent',
                                }}
                                onClick={handleLeave}>
                                Leave Team
                            </Button>
                        </Stack>}
                    <Text fontWeight={600}>Owner: {owner}</Text>
                    <Text fontSize='sm' color='gray.400'>Created on: {formatTimestamp(teamData.createdOn)}</Text>
                    <Text fontSize='sm' color='gray.400'>ID: {teamData.teamId}</Text>
                    <Divider />
                </Stack>
                {(userData!.uid === teamData.owner) && 
                <TeamOwnerMenu handleSearchOpen={handleSearchOpen} handleDelete={handleDelete} />}
                <Stack direction={{ base: 'column', md: 'row' }} alignItems="left" m={6} spacing={4}>
                    <Stack direction="column">
                        <Text fontWeight={600}>Members:</Text>
                        <TeamMembers users={members} 
                        isOwner={userData!.uid === teamData.owner} 
                        teamId={teamData.teamId} />
                    </Stack>
                    <Stack direction="column" ml={{ base: 0, md: 3 }}>
                        <Stack direction="row" mb={2} align='center'>
                            <Text fontWeight={600}>Team Info:</Text>
                            {(userData!.uid === teamData.owner) && (isEditingInfo ?
                                <Button size='sm'
                                    color={'brand.primary'}
                                    variant={'ghost'}
                                    _hover={{
                                        bg: 'brand.primary',
                                        color: 'brand.accent',
                                    }}
                                    onClick={handleInfoEdit}>Save</Button>
                                : <Button size='sm'
                                    color={'brand.primary'}
                                    variant={'ghost'}
                                    _hover={{
                                        bg: 'brand.primary',
                                        color: 'brand.accent',
                                    }}
                                    onClick={() => setIsEditingInfo(true)}>Edit</Button>)}
                        </Stack>
                        {isEditingInfo ?
                            <FroalaEditorComponent
                                model={teamInfo}
                                onModelChange={(e: string) => setTeamInfo(e)}
                                config={froalaBioConfig}
                            />
                            : <FroalaEditorView model={teamInfo} />}
                    </Stack>
                </Stack>
                <AddMemberModal isOpen={isSearchOpen} onClose={onSearchClose} teamId={urlTeamId!} />
            </Stack >
        )
    }
}