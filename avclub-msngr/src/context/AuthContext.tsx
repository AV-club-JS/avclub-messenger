/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from "react";
import { AuthContextType, DefaultUserData } from "../types/types";

export const AuthContext = createContext<AuthContextType>(null);