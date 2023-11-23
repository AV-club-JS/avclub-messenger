import { Box, ChakraProvider } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

export const Wrapper = () => {
  const [appState, setAppState] = useState({
    userData: null,
  });

  return (
    <ChakraProvider>
      <AuthContext.Provider value={{ ...appState, setAuth: setAppState }}>
        <Box
          m={0}
          p={0}
          minH={'100vh'}
          width={'100vw'}
        >
          <Outlet />
        </Box>
      </AuthContext.Provider>
    </ChakraProvider>
  )
};
