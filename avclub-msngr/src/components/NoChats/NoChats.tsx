import { Box, Flex, Heading, Text } from "@chakra-ui/react"

export const NoChats = () => {

    return (
        <Flex h={`calc(100vh - 60px)`} justifyContent="center" alignItems="center">
            <Box textAlign="center">
                <Heading
                    display="inline-block"
                    as="h2"
                    size="2xl"
                    color={'brand.accent'}
                    fontWeight={1000}
                >
                    No chats... yet
                </Heading>
                <Text color={'gray.500'} mb={6}>
                    Click on 'Search' in the navbar to find users to start chats with.
                </Text>
            </Box>
        </Flex>
    );
}