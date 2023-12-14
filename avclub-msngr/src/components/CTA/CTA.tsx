import {
    Box,
    Heading,
    Container,
    Text,
    Button,
    Stack,
} from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
export const CTA = () => {
    const navigate = useNavigate();
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
                        <Text as={'span'} color={'brand.accent'}>
                            Unlock the Future of Team Collaboration with AV Messenger
                        </Text>
                    </Heading>
                    <Stack
                        direction={'column'}
                        spacing={3}
                        align={'center'}
                        alignSelf={'center'}
                        position={'relative'}>
                        <Button
                            onClick={() => navigate('/register')}
                            colorScheme={'green'}
                            bg={'brand.accent'}
                            rounded={'full'}
                            px={6}
                            _hover={{
                                bg: 'brand.primary',
                            }}>
                            Register
                        </Button>
                    </Stack>
                </Stack>
            </Container>
        </>
    )
}