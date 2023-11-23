import { DefaultUserData } from "../types/types";

export const register = ({
    username, 
    email, 
    password, 
    phone, 
    firstName, 
    lastName }: DefaultUserData) => {
    console.log(email, password, username, phone, firstName, lastName);
}