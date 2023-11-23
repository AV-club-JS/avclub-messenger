import {
    equalTo,
    get,
    orderByChild,
    query,
    ref,
    remove,
    set,
    update,
    onValue
} from "firebase/database";
import { db } from "../config/firebase-config";
// types
import { DefaultUserData } from "../types/types";

export const createUser = async ({
    username,
    email,
    phone,
    firstName,
    lastName,
    uid
}: DefaultUserData) => {
    try {
        await set(ref(db, `users/${uid}`), {
            uid,
            username,
            email,
            firstName,
            lastName,
            phone,
            createdOn: Date.now(),
            avatarUrl: '',
        });
    } catch (error) {
        console.error((error as Error).message);
    }
};

export const getUserByUid = async (uid: string) => {
    try {
        const data = await get(ref(db, `users/${uid}`));
        return data;
    } catch (error) {
        console.error((error as Error).message);
        return null;
    }
};
