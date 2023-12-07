import { Stack, Heading, Divider, Button, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState, useContext } from "react";
import { Outlet } from "react-router-dom";
import { UserContext } from "../../context/AuthContext";
import { DefaultTeamData } from "../../types/types";
import { TeamsDisplay } from "../../components/TeamsDisplay";
import { getTeamInfo, removeUserTeam } from "../../services";
import { CreateTeam } from "../../components/CreateTeam";


export const Teams = () => {
    const { userData } = useContext(UserContext);
    const [teamsArr, setTeamsArr] = useState<DefaultTeamData[]>([]);
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
    const [loading, setLoading] = useState(true);

    const handleCreateOpen = () => {
        onCreateOpen();
    };

    useEffect(() => {
        if (userData && userData.teamIds) {
            (async () => {
                const teamKeys = Object.keys(userData.teamIds!);
                const teams: DefaultTeamData[] = [];

                for (const key of teamKeys) {
                    const data = await getTeamInfo(key);

                    if (data) {
                        teams.push(data);
                    } else {
                        await removeUserTeam(userData.uid, key);
                    }
                }

                setTeamsArr(teams);
                setLoading(false);
            })()
        }
    }, [userData]);

    if (userData && !loading) {
        return (
            <Stack direction='row' gap={1} h={`calc(100vh - 60px)`} overflowY={'hidden'}>
                <Stack direction='column'
                    bgColor='white'
                    borderRight='1px solid'
                    borderColor='gray.100'
                    w='23%'>
                    <Button w='50%' m={2}
                        fontSize='20'
                        color={'brand.primary'}
                        variant={'ghost'}
                        _hover={{
                            bg: 'brand.primary',
                            color: 'brand.accent',
                        }}
                        onClick={handleCreateOpen}>Create Team</Button>
                    <CreateTeam isOpen={isCreateOpen} onClose={onCreateClose} />
                    <Heading m={3}>Teams</Heading>
                    <Divider />
                    <Stack direction={'column'} overflow={'auto'} ml={4}>
                        {teamsArr.length > 0 && <TeamsDisplay teams={teamsArr} />}
                    </Stack>
                </Stack>
                <Stack direction='column' w={'77%'}>
                    <Outlet />
                </Stack>
            </Stack>
        )
    }
}