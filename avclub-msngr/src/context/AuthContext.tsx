/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from "react";
import { AuthContext } from "../types/types";

export const UserContext = createContext<AuthContext>({
    user: null,
    userData: null,
    setAuth: () => {}
});


