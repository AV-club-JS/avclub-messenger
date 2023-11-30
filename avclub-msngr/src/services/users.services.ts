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
import { getDownloadURL, uploadBytes, ref as storageRef } from "firebase/storage";
// database, storage
import { db, storage } from "../config/firebase-config";
// types
import { DefaultUserData, SetCount } from "../types/types";
// constants
import { AVATARS, USERS } from "../constants/servicesConstants";

export const createUser = async ({
    username,
    email,
    phone,
    firstName,
    lastName,
    uid
}: DefaultUserData) => {
    try {
        await set(ref(db, `${USERS}/${uid}`), {
            uid,
            username,
            email,
            firstName,
            lastName,
            phone,
            createdOn: Date.now(),
            avatarUrl: '',
            status: 'online',
            bio: ''
        });
    } catch (error) {
        console.error((error as Error).message);
    }
};

export const getUserByUid = async (uid: string) => {
    const data = await get(ref(db, `${USERS}/${uid}`));
    return data;
};

export const getUserCount = (setUserCount: SetCount) => {
    const usersRef = ref(db, `${USERS}/`);

    return onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        const userCount = data ? Object.keys(data).length : 0;
        setUserCount(userCount);
    })
}

export const getUserRef = (uid: string) => {
    return ref(db, `${USERS}/${uid}`);
};

export const updateUserData = async (uid: string, data: object) => {
    const userRef = getUserRef(uid);
    await update(userRef, data);
    return true;

};

export const changeUserAvatar = async (userUid: string, avatar: File) => {
        const storageUserRef = storageRef(storage, `/${AVATARS}/${userUid}`);
        await uploadBytes(storageUserRef, avatar);

        const url = await getDownloadURL(storageUserRef);

        await updateUserData(userUid, { avatarUrl: url });
        return url;
};


