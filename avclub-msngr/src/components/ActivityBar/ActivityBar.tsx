import { Box, SimpleGrid, Stack, Flex, Text, Center, Icon } from "@chakra-ui/react";
import { AiOutlineUser, AiOutlineTeam } from "react-icons/ai";

export const ActivityBar = ({ users = '55', teams = '66'}) => {
    return (
        <Center p={7} bgColor={'#001f3f'}>
            <Box maxW={"5xl"} >
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={20}>
                    <Stack alignItems={'center'}>
                        <Flex
                            w={16}
                            h={16}
                            align={"center"}
                            justify={"center"}
                            color={"white"}
                            rounded={"full"}
                            bg={"gray.100"}
                            mb={1}
                            bgColor={'#77D4FC'}
                        >
                            <Icon as={AiOutlineUser} boxSize={10}/>
                        </Flex>
                        <Text fontWeight={1000} color={'white'}>Users: {users}</Text>
                    </Stack>
                    <Stack alignItems={'center'}>
                        <Flex
                            w={16}
                            h={16}
                            align={"center"}
                            justify={"center"}
                            color={"white"}
                            rounded={"full"}
                            bg={"gray.100"}
                            mb={1}
                            bgColor={'#77D4FC'}
                        >
                            <Icon as={AiOutlineTeam} boxSize={10}/>
                        </Flex>
                        <Text fontWeight={1000} color={'white'}>Teams: {teams}</Text>
                    </Stack>
                </SimpleGrid>
            </Box>
        </Center>
    );
};
