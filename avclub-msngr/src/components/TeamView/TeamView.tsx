import { Text, Flex, Stack, Heading, Divider, Button, FormControl, Center, Input } from "@chakra-ui/react";
import { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../context/AuthContext";
import { DefaultTeamData, DefaultUserData } from "../../types/types";
import { listenTeamData, getUserByUid, getUsersByTeam, updateTeamData } from "../../services";
import { Unsubscribe } from "firebase/database";
import { formatTimestamp } from "../../utils/formatTimestamp";
import { TeamMembers } from "../TeamMembers";

export const TeamView = () => {
    const { teamId: urlTeamId } = useParams();
    const [teamData, setTeamData] = useState<DefaultTeamData>(null!);
    const [owner, setOwner] = useState('');
    const [members, setMembers] = useState<DefaultUserData[]>([]);
    const { userData } = useContext(UserContext);
    const [isEditingTeamName, setIsEditingTeamName] = useState(false);
    const [teamName, setTeamName] = useState('');

    const handleTeamNameEdit = async () => {
        if (teamName.length < 5) {
            alert('Team name must be at least five symbols!');
            setIsEditingTeamName(false);
            return;
        }

        try {
            await updateTeamData(teamData.teamId, { name: teamName });
            setIsEditingTeamName(false);
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
                    const membersData = await getUsersByTeam(teamData.teamId);

                    setOwner(ownerData.username);
                    setMembers(membersData);

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

            return () => {
                disconnectTeamListener();
            }
        }
    }, [urlTeamId])

    if (teamData && owner) {
        return (
            <Flex direction="column" px={4} mt={4}>
                <Stack direction='column' align='center'>
                    <Stack alignItems='center'>
                        <FormControl>
                            {isEditingTeamName ?
                                <Input
                                    value={teamName}
                                    onChange={e => setTeamName(e.target.value)}></Input>
                                : <Heading>{teamData.name}</Heading>}
                            <Center>
                                {(userData!.uid === teamData.owner) && (isEditingTeamName ?
                                    <Button size='sm'
                                        onClick={handleTeamNameEdit}>Save</Button>
                                    : <Button size='sm'
                                        onClick={() => setIsEditingTeamName(true)}>
                                        Edit</Button>)}
                            </Center>
                        </FormControl>
                    </Stack>
                    <Text fontWeight={600}>Owner: {owner}</Text>
                    <Text fontSize='sm' color='gray.400'>Created on: {formatTimestamp(teamData.createdOn)}</Text>
                    <Text fontSize='sm' color='gray.400'>ID:{teamData.teamId}</Text>
                    <Divider />
                </Stack>
                <Stack direction='column' alignItems='left' m={6}>
                    <Text fontWeight={600}>Members:</Text>
                    <TeamMembers users={members} />
                    {(userData!.uid === teamData.owner) && <Button w={'10%'} fontSize='sm'>Add Member</Button>}
                </Stack>
            </Flex>
        )
    }
}