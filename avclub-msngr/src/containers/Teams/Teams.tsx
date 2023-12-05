import { Stack, Heading, Divider, Button, Text } from "@chakra-ui/react";
import { useEffect, useState, useContext } from "react";
import { Outlet } from "react-router-dom";
import { UserContext } from "../../context/AuthContext";
import { DefaultTeamData } from "../../types/types";
import { TeamsDisplay } from "../../components/TeamsDisplay";
import { getTeamInfo } from "../../services";


export const Teams = () => {
    const { userData } = useContext(UserContext);
    const [teamsArr, setTeamsArr] = useState<DefaultTeamData[]>([]);


    useEffect(() => {
        if (userData && userData.teamIds) {
            (async () => {
                const teamKeys = Object.keys(userData.teamIds!);
                const teams: DefaultTeamData[] = [];
                
                for (const key of teamKeys) {
                    const data = await getTeamInfo(key);
                    teams.push(data);
                }
                
                console.log(teams);
                
                setTeamsArr(teams);
                
                console.log(teamsArr);
            })()
        }
    }, [userData]);

    if (userData) {
        return (
            <Stack direction='row' gap={1} h={`calc(100vh - 60px)`} overflowY={'hidden'}>
                <Stack direction='column' 
                bgColor='white' 
                borderRight='1px solid'
                borderColor='gray.100' 
                w='23%'>
                    <Button w='50%' m={2}
                        color={'brand.primary'}
                        variant={'ghost'}
                        fontSize='20'
                        _hover={{
                            bg: 'brand.primary',
                            color: 'brand.accent',
                        }}>Create Team</Button>
                    <Heading m={3}>Teams</Heading>
                    <Divider />
                    <Stack direction={'column'} overflow={'auto'} ml={4}>
                        {teamsArr.length > 0 && <TeamsDisplay teams={teamsArr} />}
                    </Stack>
                </Stack>
                <Stack direction='column' w={'77%'}>
                    <Outlet/>
                </Stack>
            </Stack>
        )
    }
}