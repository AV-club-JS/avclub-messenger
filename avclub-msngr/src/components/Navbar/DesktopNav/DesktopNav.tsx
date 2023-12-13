import {
    Box,
    Stack,
    useColorModeValue
} from '@chakra-ui/react';
import { NAV_ITEMS } from '../../../constants/navItems';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../../context/AuthContext';

export const DesktopNav = () => {
    const linkColor = useColorModeValue('brand.primary', 'gray.200');
    const linkHoverColor = useColorModeValue('brand.accent', 'white');
    const navigate = useNavigate();
    const { userData } = useContext(UserContext);

    const handleNavigate = (label: string, nav: string) => {
        if (label === 'Profile') {
            navigate(`/profile/${userData?.uid}`)
        } else {
            navigate(nav);
        }
    }

    return (
        <Stack direction={'row'} spacing={4}>
            {NAV_ITEMS.map((navItem) => (
                <Box key={navItem.label}>
                            <Box
                                borderRadius='md'
                                as="a"
                                p={2}
                                onClick={() => handleNavigate(navItem.label, navItem.nav)}
                                fontSize={'sm'}
                                fontWeight={600}
                                color={linkColor}
                                _hover={{
                                    textDecoration: 'none',
                                    color: linkHoverColor,
                                    bg: 'brand.primary',
                                    cursor: 'pointer'
                                }}>
                                {navItem.label}
                            </Box>
                </Box>
            ))}
        </Stack>
    )
}