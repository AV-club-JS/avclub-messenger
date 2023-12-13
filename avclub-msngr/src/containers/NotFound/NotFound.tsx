import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Box textAlign="center" py={10} px={6}>
            <Heading
                display="inline-block"
                as="h2"
                size="2xl"
                color={'brand.accent'}
                fontWeight={1000}
                >
                404
            </Heading>
            <Text fontSize="18px" mt={3} mb={2}>
                That&apos;s odd
            </Text>
            <Text color={'gray.500'} mb={6}>
                The page you&apos;re looking for does not seem to exist
            </Text>

            <Button
                color="white"
                variant="solid"
                bgColor={'brand.accent'}
                _hover={{
                    bg: 'brand.primary',
                }}
                onClick={() => navigate(-1)}
                >
                Go Back
            </Button>
        </Box>
    )
}