import {
    Container,
    SimpleGrid,
    Image,
    Flex,
    Heading,
    Text,
    Stack,
    StackDivider,
    Icon,
    useColorModeValue,
} from '@chakra-ui/react';
import { AiOutlineMessage, AiOutlineTeam, AiOutlineVideoCamera } from "react-icons/ai";
import { SingleFeature } from './SingleFeature';

export const Features = () => {
    return (
        <Container maxW={'5xl'} py={12}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                <Stack spacing={4}>
                    <Heading fontWeight={1000}>Empower Your Team with AV Messenger</Heading>
                    <Text color={'gray.500'} fontSize={'lg'}>
                        Transform How You Communicate: Seamless Collaboration, Ultimate Connectivity!
                    </Text>
                    <Stack
                        spacing={4}
                        divider={
                            <StackDivider borderColor={useColorModeValue('gray.100', 'gray.700')} />
                        }>
                        <SingleFeature
                            icon={<Icon as={AiOutlineTeam} color={'brand.primary'} w={5} h={5} />}
                            iconBg={useColorModeValue('blue.100', 'blue.900')}
                            text={'Team Up, Plan and Collaborate'}
                        />
                        <SingleFeature
                            icon={<Icon as={AiOutlineMessage} color={'brand.primary'} w={5} h={5} />}
                            iconBg={useColorModeValue('green.100', 'green.900')}
                            text={'Upgrade Your Chat Experience'} />
                        <SingleFeature
                            icon={<Icon as={AiOutlineVideoCamera} color={'brand.primary'} w={5} h={5} />}
                            iconBg={useColorModeValue('purple.100', 'purple.900')}
                            text={'Elevate Team Communication with Video Conferencing'}
                        />
                    </Stack>
                </Stack>
                <Flex>
                    <Image
                        rounded={'md'}
                        alt={'feature image'}
                        src={
                            'https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
                        }
                        objectFit={'cover'}
                        loading={'eager'}
                        border={'4px'}  // Add a 1px border
                        borderColor={'brand.primary'}
                    />
                </Flex>
            </SimpleGrid>
        </Container>
    )
}