import { Box, ChakraProvider } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserContext } from "../../context/AuthContext";
import { AppState } from "../../types/types";
import { Navbar } from "../../components/Navbar";
import customTheme from "../../theme/theme";
import { auth } from "../../config/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { getUserByUid, setUserDataListen } from "../../services";
import { Unsubscribe } from "firebase/database";

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
    if (!user) {
      return;
    }

    let disconnect: Unsubscribe;

    try {
      disconnect = setUserDataListen(user?.uid as string, setAppState);
    } catch (error) {
      console.error(error);
    }

    return () => {
      disconnect();
    };
  }, [user]);

  if (!loading && !userDataLoading) {
    return (
      <ChakraProvider theme={customTheme}>
        <UserContext.Provider value={{ ...appState, setAuth: setAppState }}>
          <Box
            m={0}
            p={0}
            minH={"100vh"}
            w={"100vw"}
            maxW={"100%"}
          >
            <Navbar />
            <Outlet />
          </Box>
        </UserContext.Provider>
      </ChakraProvider>
    );
  }
};
