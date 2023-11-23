import { UserLoginData } from "../types/types";

export const login = ({email, password}: UserLoginData): void => {
    console.log(email, password);
}
