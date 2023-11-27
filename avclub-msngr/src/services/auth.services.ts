import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";
// context
import { auth } from "../config/firebase-config";
// types
import { Credentials } from "../types/types";

export const registerUser =  ({email, password}: Credentials) => {
    return createUserWithEmailAndPassword(auth, email, password);
}

export const loginUser = ({email, password}: Credentials) => {
    return signInWithEmailAndPassword(auth, email, password);
}

export const logoutUser = () => {
    return signOut(auth);
}
