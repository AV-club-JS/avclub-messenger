import {
    Box,
    Flex,
    Text,
    IconButton,
    Button,
    Stack,
    Collapse,
    useColorModeValue,
    useBreakpointValue,
    useDisclosure,
    Avatar,
    AvatarBadge
} from '@chakra-ui/react';
import {
    HamburgerIcon,
    CloseIcon,
} from '@chakra-ui/icons';
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// components
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';
import { UserContext } from '../../context/AuthContext';
// services
import { logoutUser } from '../../services';
// utils
import { getStatusBadgeColor } from '../../utils/profileUtils';

export const Navbar = () => {
    const { isOpen, onToggle } = useDisclosure();
    const { user, userData } = useContext(UserContext);
    const [downloadURL, setDownloadURL] = useState<string | null>(null);
    const [userStatus, setUserStatus] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (userData) {
            setDownloadURL(userData.avatarUrl);
            setUserStatus(userData.status);
        }
    }, [userData])

    return (
        <Box>
            <Flex
                bg={useColorModeValue('white', 'gray.800')}
                color={useColorModeValue('gray.600', 'white')}
                minH={'60px'}
                py={{ base: 2 }}
                px={{ base: 4 }}
                borderBottom={1}
                borderStyle={'solid'}
                borderColor={useColorModeValue('gray.200', 'gray.900')}
                align={'center'}>
                {user && <Flex
                    flex={{ base: 1, md: 'auto' }}
                    ml={{ base: -2 }}
                    display={{ base: 'flex', md: 'none' }}>
                    <IconButton
                        onClick={onToggle}
                        icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
                        variant={'ghost'}
                        aria-label={'Toggle Navigation'}
                    />
                </Flex>}
                <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
                    <Text
                        textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
                        fontFamily={'heading'}
                        ml={'20px'}
                        color={useColorModeValue('gray.800', 'white')}>
                        AVM
                    </Text>

                    <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
                        {user && <DesktopNav />}
                    </Flex>
                </Flex>
                <Stack
                    flex={{ base: 1, md: 0 }}
                    justify={'flex-end'}
                    direction={'row'}
                    spacing={6}>

                    {!user ?
                        <>
                            <Button as={'a'} fontSize={'sm'} fontWeight={400} variant={'link'} href={'login'}>
                                Login
                            </Button>
                            <Button
                                as={'a'}
                                display={{ base: 'none', md: 'inline-flex' }}
                                fontSize={'sm'}
                                fontWeight={600}
                                color={'white'}
                                bg={'brand.accent'}
                                href={'register'}
                                mr={'20px'}
                                _hover={{
                                    bg: 'brand.primary',
                                }}>
                                Register
                            </Button>
                        </> : <>
                            <Button
                                as={'a'}
                                fontSize={'sm'}
                                fontWeight={600}
                                color={'white'}
                                bg={'brand.accent'}
                                href={'/'}
                                onClick={logoutUser}
                                mr={'20px'}
                                size='sm'
                                _hover={{
                                    bg: 'brand.primary',
                                }}>
                                Logout
                            </Button>
                            <Avatar size="sm"
                            src={downloadURL!}
                            onClick={() => navigate('/profile')}
                            _hover={{
                                cursor:"pointer"
                            }}>
                                <AvatarBadge boxSize="1em" bg={getStatusBadgeColor(userStatus!)} />
                            </Avatar>
                        </>
                    }
                </Stack>
            </Flex>

            <Collapse in={isOpen} animateOpacity>
                <MobileNav />
            </Collapse>
        </Box>
    )
}

