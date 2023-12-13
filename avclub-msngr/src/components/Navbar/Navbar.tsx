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
    AvatarBadge,
    Image,
} from '@chakra-ui/react';
import {
    HamburgerIcon,
    CloseIcon,
} from '@chakra-ui/icons';
import { Search2Icon } from '@chakra-ui/icons';
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo-no-background.png'
// components
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';
import { UserContext } from '../../context/AuthContext';
import { NavSearchModal } from './NavSearchModal';
// services
import { logoutUser, updateUserData } from '../../services';
// utils
import { getStatusBadgeColor } from '../../utils/profileUtils';

export const Navbar = () => {
    const { isOpen: isHamburgerOpen, onToggle: onHamburgerToggle } = useDisclosure();
    const { isOpen: isSearchOpen, onOpen: onSearchOpen, onClose: onSearchClose } = useDisclosure();
    const { user, userData } = useContext(UserContext);
    const [downloadURL, setDownloadURL] = useState<string | null>(null);
    const [userStatus, setUserStatus] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser();
            await updateUserData(userData!.uid, { status: 'offline' });
            navigate('/');
        } catch (error) {
            console.error(error);
        }

    }

    const handleSearchOpen = () => {
        onSearchOpen();
    };

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
                        onClick={onHamburgerToggle}
                        icon={isHamburgerOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
                        variant={'ghost'}
                        aria-label={'Toggle Navigation'}
                    />
                </Flex>}
                <Flex flex={{ base: 1 }} justify={{ base: 'left', md: 'start' }}>
                    <Image src={logo} 
                    htmlWidth='75px'
                    htmlHeight='30px'/>
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
                            <Button as={'a'} fontSize={'sm'} fontWeight={400} variant={'link'} onClick={() => navigate('login')}>
                                Login
                            </Button>
                            <Button
                                as={'a'}
                                display={{ base: 'none', md: 'inline-flex' }}
                                fontSize={'sm'}
                                fontWeight={600}
                                color={'white'}
                                bg={'brand.accent'}
                                onClick={() => navigate('register')}
                                mr={'20px'}
                                _hover={{
                                    bg: 'brand.primary',
                                }}>
                                Register
                            </Button>
                        </> : <>
                            <Flex display={{ base: 'sm', md: 'flex' }} mr={2} w={'40%'}>
                                <Button size='sm'
                                    onClick={handleSearchOpen}
                                    color={'brand.primary'}
                                    variant={'ghost'}
                                    _hover={{
                                        bg: 'brand.primary',
                                        color: 'brand.accent',
                                    }}>
                                    <Search2Icon mr={1} />Search
                                </Button>
                            </Flex>
                            <NavSearchModal isOpen={isSearchOpen} onClose={onSearchClose} />
                            <Button
                                as={'a'}
                                fontSize={'sm'}
                                fontWeight={600}
                                onClick={() => handleLogout()}
                                mr={'20px'}
                                size='sm'
                                color={'brand.primary'}
                                variant={'ghost'}
                                _hover={{
                                    bg: 'brand.primary',
                                    color: 'brand.accent',
                                }}>
                                Logout
                            </Button>
                            <Avatar size="sm"
                                src={downloadURL!}
                                onClick={() => navigate(`/${userData?.uid}`)}
                                _hover={{
                                    cursor: "pointer"
                                }}>
                                <AvatarBadge boxSize="1em" bg={getStatusBadgeColor(userStatus!)} />
                            </Avatar>
                        </>
                    }
                </Stack>
            </Flex>

            <Collapse in={isHamburgerOpen} animateOpacity>
                <MobileNav />
            </Collapse>
        </Box>
    )
}

