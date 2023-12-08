import { Stack, Heading, Divider, Button, useDisclosure, Box } from "@chakra-ui/react";
import { useEffect, useState, useContext } from "react";
import { Outlet } from "react-router-dom";
import { UserContext } from "../../context/AuthContext";
import { DefaultTeamData } from "../../types/types";
import { TeamsDisplay } from "../../components/TeamsDisplay";
import { getTeamInfo, removeUserTeam } from "../../services";
import { CreateTeam } from "../../components/CreateTeam";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";


export const Teams = () => {
    const { userData } = useContext(UserContext);
    const [teamsArr, setTeamsArr] = useState<DefaultTeamData[]>([]);
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
    const [loading, setLoading] = useState(true);
    const [isLeftSectionOpen, setIsLeftSectionOpen] = useState(true);

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

    const toggleLeftSection = () => {
        setIsLeftSectionOpen(!isLeftSectionOpen);
    };

    if (userData && !loading) {
        return (
            <Stack direction={{ base: "column", md: "row" }} gap={1} h={`calc(100vh - 60px)`} overflowY={'hidden'}>
                <Stack
                    direction='column'
                    bgColor='white'
                    borderRight='1px solid'
                    borderColor='gray.100'
                    w={isLeftSectionOpen ? { base: "100%", md: "25%" } : '0%'}
                >
                    <Button
                        position='relative'
                        mt={2}
                        ml={3}
                        minW="fit-content" maxW="fit-content"
                        size='sm'
                        fontSize='20'
                        color={'brand.primary'}
                        variant={'outline'}
                        _hover={{
                            bg: 'brand.primary',
                            color: 'brand.accent',
                        }}
                        onClick={toggleLeftSection}
                    >
                        {isLeftSectionOpen ? <ArrowLeftIcon /> : <ArrowRightIcon />}
                    </Button>
                    {isLeftSectionOpen &&
                        <Box>
                            <Button m={2}
                                minW="fit-content" maxW="fit-content"
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
                        </Box>}
                </Stack>
                <Stack direction='column' w='100%'>
                    <Outlet />
                </Stack>
            </Stack>
        )
    }
}