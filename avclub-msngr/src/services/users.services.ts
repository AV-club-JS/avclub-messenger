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
// d
import { db } from "../config/firebase-config";
// types
import { DefaultUserData, SetCount } from "../types/types";

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
    const data = await get(ref(db, `users/${uid}`));
    return data;
};

export const getUserCount = (setUserCount: SetCount) => {
    const usersRef = ref(db, 'users/');
    
    return onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        const userCount = data ? Object.keys(data).length : 0; 
        setUserCount(userCount);
    })
}