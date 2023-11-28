import { Box, ChakraProvider } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { UserContext } from '../../context/AuthContext';
import { AppState } from '../../types/types';
import { Navbar } from '../../components/Navbar';
import customTheme from '../../theme/theme';
import { auth } from '../../config/firebase-config';
import { useAuthState } from "react-firebase-hooks/auth";
import { getUserByUid } from '../../services';

export const Wrapper = () => {
  const [appState, setAppState] = useState<AppState>({
    user: null,
    userData: null,
  });
  const [user, loading] = useAuthState(auth);

  const [userDataLoading, setUserDataLoading] = useState(false);

  if (appState.user !== user) {
    setAppState({ ...appState, user });
  }

  useEffect(() => {
    (async () => {
      if (user === null) {
        return;
      }
      try {
        setUserDataLoading(true);
        const req = await getUserByUid(user.uid);
        const data = req.val();
        setAppState({
          ...appState,
          userData: { ...data },
        });
      } catch (error) {
        console.error(error);
      } finally {
        setUserDataLoading(false);
      }
    })();
  }, [user]);

  if (!loading && !userDataLoading) {

    return (
      <ChakraProvider theme={customTheme}>
        <UserContext.Provider value={{ ...appState, setAuth: setAppState }}>
          <Box
            m={0}
            p={0}
            minH={'100vh'}
            w={'100vw'}
            maxW={'100%'}
          >
            <Navbar />
            <Outlet />
          </Box>
        </UserContext.Provider>
      </ChakraProvider>
    )
  };
}