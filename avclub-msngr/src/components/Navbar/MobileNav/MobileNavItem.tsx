import {
    Box,
    Text,
    Stack,
    useColorModeValue,
} from '@chakra-ui/react';
import { NavItem } from '../../../types/types';
import { useNavigate } from 'react-router-dom';

export const MobileNavItem = ({ label, nav }: NavItem) => {
    const navigate = useNavigate();

    return (
        <Stack spacing={4}>
            <Box
                py={2}
                as="a"
                onClick={() => navigate(nav)}
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