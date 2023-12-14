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
import { getFeaturesImage } from '../../services/home.services';
import { useEffect, useState } from 'react';

export const Features = () => {
    const [featuresImageURL, setFeaturesImageURL] = useState('');

    useEffect(() => {
        (async () => {
            const url = await getFeaturesImage();
            setFeaturesImageURL(url);
        })()
    }, []);

    return (
        <Container maxW={'5xl'} py={12}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                <Stack spacing={4}>
                    <Heading fontWeight={1000}>Empower Your Team with AVMessenger</Heading>
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
                            iconBg={'brand.accent'}
                            text={'Team Up, Plan and Collaborate'}
                        />
                        <SingleFeature
                            icon={<Icon as={AiOutlineMessage} color={'brand.primary'} w={5} h={5} />}
                            iconBg={'brand.accent'}
                            text={'Upgrade Your Chat Experience'} />
                        <SingleFeature
                            icon={<Icon as={AiOutlineVideoCamera} color={'brand.primary'} w={5} h={5} />}
                            iconBg={'brand.accent'}
                            text={'Elevate Team Communication with Video Conferencing'}
                        />
                    </Stack>
                </Stack>
                <Flex>
                    {featuresImageURL && 
                    <Image
                        rounded={'md'}
                        alt={'feature image'}
                        src={featuresImageURL}
                        objectFit={'cover'}
                        loading={'eager'}
                        border={'4px'} 
                        borderColor={'brand.accent'}
                    />}
                </Flex>
            </SimpleGrid>
        </Container>
    )
}