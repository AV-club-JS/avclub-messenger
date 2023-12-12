import {
    Box,
    Text,
    Stack,
    useColorModeValue,
} from '@chakra-ui/react';
import { NavItem } from '../../../types/types';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../../context/AuthContext';

export const MobileNavItem = ({ label, nav }: NavItem) => {
    const navigate = useNavigate();
    const { userData } = useContext(UserContext);
    
    const handleNavigate = (label: string, nav: string) => {
        if (label === 'Profile') {
            navigate(`/${userData?.uid}`)
        } else {
            navigate(nav);
        }
    }

    return (
        <Stack spacing={4}>
            <Box
                py={2}
                as="a"
                onClick={() => handleNavigate(label, nav)}
                justifyContent="space-between"
                alignItems="center"
                _hover={{
                    textDecoration: 'none',
                }}>
                <Text fontWeight={600} color={useColorModeValue('gray.600', 'gray.200')}>
                    {label}
                </Text>
            </Box>
        </Stack>
    )
}