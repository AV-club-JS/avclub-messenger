import { Text, Flex, Stack, Heading, Divider, Button, FormControl, Center, Input, useDisclosure, FormErrorMessage } from "@chakra-ui/react";
import { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../context/AuthContext";
import { DefaultTeamData, DefaultUserData } from "../../types/types";
import { listenTeamData, getUserByUid, getUsersByTeam, updateTeamData, doesTeamNameExist } from "../../services";
import { Unsubscribe } from "firebase/database";
import { formatTimestamp } from "../../utils/formatTimestamp";
import { TeamMembers } from "../TeamMembers";
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

    const handleSearchOpen = () => {
        onSearchOpen();
    };


    const handleTeamNameEdit = async () => {

        if (teamName.length < 5) {
            setTeamNameInvalid(true);
            setTeamNameError('Team name must be at least five symbols.');
            console.log(teamNameInvalid);
            console.log(teamNameError);
            return;
        }
        try {
            const check = await doesTeamNameExist(teamName);
            if (teamName == teamData.name) {
                return;
            }
            if (check == true) {
                setTeamNameInvalid(true);
                setTeamNameError('This name already exists.');
                return;
            }
            await updateTeamData(teamData.teamId, { name: teamName });
            console.log(check);
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

    useEffect(() => {
        if (teamData) {
            (async () => {
                try {
                    const req = await getUserByUid(teamData.owner);
                    const ownerData = req.val();
                    setOwner(ownerData.username);
                    const membersData = await getUsersByTeam(teamData.teamId);

                    setMembers([...membersData]);
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
            <Stack direction="column" px={4} mt={4}>
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
                                    <Button size="sm" onClick={handleTeamNameEdit}>
                                        Save
                                    </Button>
                                ) : (
                                    <Button size="sm" onClick={() => setIsEditingTeamName(true)}>
                                        Edit
                                    </Button>
                                ))}
                            </Center>
                        </FormControl>
                    </Stack>
                    <Text fontWeight={600}>Owner: {owner}</Text>
                    <Text fontSize='sm' color='gray.400'>Created on: {formatTimestamp(teamData.createdOn)}</Text>
                    <Text fontSize='sm' color='gray.400'>ID:{teamData.teamId}</Text>
                    <Divider />
                </Stack>
                <Stack direction='row' alignItems='left' m={6}>
                    <Stack direction='column'>
                        <Text fontWeight={600}>Members:</Text>
                        <TeamMembers users={members} />
                    </Stack>
                    <Stack direction='column' ml={3}>
                        <Stack direction='row'>
                            <Text fontWeight={600}>Team Info:</Text>
                            {(userData!.uid === teamData.owner) && (isEditingInfo ?
                                <Button size='sm'
                                    onClick={handleInfoEdit}>Save</Button>
                                : <Button size='sm'
                                    onClick={() => setIsEditingInfo(true)}>
                                    Edit</Button>)}
                        </Stack>
                        {isEditingInfo ?
                            <FroalaEditorComponent
                                model={teamInfo}
                                onModelChange={(e: string) => setTeamInfo(e)}
                                config={froalaBioConfig} />
                            : <FroalaEditorView model={teamInfo} />}
                    </Stack>
                </Stack>
                {(userData!.uid === teamData.owner) && <Button w={'10%'} fontSize='sm' onClick={handleSearchOpen}>
                    Add Member
                </Button>}
                <AddMemberModal isOpen={isSearchOpen} onClose={onSearchClose} teamId={urlTeamId!} />
            </Stack>
        )
    }
}