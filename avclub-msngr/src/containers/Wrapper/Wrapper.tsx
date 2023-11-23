import { Box, ChakraProvider } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { UserContext } from '../../context/AuthContext';
import { AppState } from '../../types/types';
import { Footer } from '../../components/Footer';
export const Wrapper = () => {
  const [appState, setAppState] = useState<AppState>({
    user: null,
    userData: null,
  });

  return (
    <ChakraProvider>
      <UserContext.Provider value={{ ...appState, setAuth: setAppState }}>
        <Box
          m={0}
          p={0}
          minH={'100vh'}
          width={'100vw'}
        >
          <Outlet />
        <Footer/>
        </Box>
      </UserContext.Provider>
    </ChakraProvider>
  )
};
