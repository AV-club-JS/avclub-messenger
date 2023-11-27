import { Box, ChakraProvider } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { UserContext } from '../../context/AuthContext';
import { AppState } from '../../types/types';
import { Footer } from '../../components/Footer';
import { Navbar } from '../../components/Navbar';
import customTheme from '../../theme/theme';

export const Wrapper = () => {
  const [appState, setAppState] = useState<AppState>({
    user: null,
    userData: null,
  });

  return (
    <ChakraProvider theme={customTheme}>
      <UserContext.Provider value={{ ...appState, setAuth: setAppState }}>
        <Box
          m={0}
          p={0}
          minH={'100vh'}
          width={'100vw'}
        >
          <Navbar />
          <Outlet />
        <Footer/>
        </Box>
      </UserContext.Provider>
    </ChakraProvider>
  )
};
