import {
    Box,
    Heading,
    Container,
    Text,
    Button,
    Stack,
} from '@chakra-ui/react'

export const CTA = () => {
    return (
        <>
            <Container maxW={'3xl'}>
                <Stack
                    as={Box}
                    textAlign={'center'}
                    spacing={{ base: 8, md: 14 }}
                    py={{ base: 8, md: 16 }}>
                    <Heading
                        fontWeight={1000}
                        fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
                        lineHeight={'110%'}>
                        Instant, Intuitive, Irreplaceable<br />
                        <Text as={'span'} color={'blue.400'}>
                        Unlock the Future of Team Collaboration with AV Messenger
                        </Text>
                    </Heading>
                    <Text color={'gray.500'}>
                        Monetize your content by charging your most loyal readers and reward them
                        loyalty points. Give back to your loyal readers by granting them access to
                        your pre-releases and sneak-peaks.
                    </Text>
                    <Stack
                        direction={'column'}
                        spacing={3}
                        align={'center'}
                        alignSelf={'center'}
                        position={'relative'}>
                        <Button
                            colorScheme={'green'}
                            bg={'blue.400'}
                            rounded={'full'}
                            px={6}
                            _hover={{
                                bg: '#001f3f',
                            }}>
                            Register
                        </Button>
                        <Text color={'gray.500'} fontWeight={600} fontSize={'md'}>Already have an account?</Text>
                        <Button
                            colorScheme={'blue'}
                            bg={'blue.400'}
                            rounded={'full'}
                            px={6}
                            _hover={{
                                bg: '#001f3f',
                            }}>
                            Login
                        </Button>
                    </Stack>
                </Stack>
            </Container>
        </>
    )
}