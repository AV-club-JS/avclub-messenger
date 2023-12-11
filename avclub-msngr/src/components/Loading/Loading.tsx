import { Flex, Spinner, Text, VStack } from "@chakra-ui/react"

export const Loading = () => {

    return (
        <Flex h={`calc(100vh - 60px)`} bgColor={'gray.300'} justifyContent="center"
            alignItems="center">
            <VStack>
                <Spinner size='xl'
                    color='brand.primary'
                    thickness='8px'
                    speed='0.65s'
                />
                <Text display='block' fontWeight={600}>Loading</Text>

            </VStack>
        </Flex>
    )
}