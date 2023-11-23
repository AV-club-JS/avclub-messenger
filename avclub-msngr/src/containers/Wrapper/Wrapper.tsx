import { Box, ChakraProvider } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
export const Wrapper = () => {
  return (
    <ChakraProvider>
      <Box
        m={0}
        p={0}
        minH={'100vh'}
        width={'100vw'}
      >
        <Outlet />
      </Box>
    </ChakraProvider>
  )
};
