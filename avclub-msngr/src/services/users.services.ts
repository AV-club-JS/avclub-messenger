import {
  DataSnapshot,
  endAt,
  equalTo,
  get,
  onValue,
  orderByChild,
  query,
  ref,
  remove,
  set,
  startAt,
  update,
} from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
// database, storage
import { db, storage } from "../config/firebase-config";
// types
import { DefaultUserData, SetCount, SetUserData } from "../types/types";
// constants
import { AVATARS, USERS } from "../constants/servicesConstants";

const usersRef = ref(db, `${USERS}/`);

export const createUser = async ({
  username,
  email,
  phone,
  firstName,
  lastName,
  uid,
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
      avatarUrl: "",
      status: "online",
      bio: "",
    });
  } catch (error) {
    console.error((error as Error).message);
  }
};

export const getUserByUid = async (uid: string): Promise<DataSnapshot> => {
  const data = await get(ref(db, `users/${uid}`));
  return data;
};

export const getUserDataByUid = async (
  uid: string,
): Promise<{ data?: DefaultUserData; error?: string }> => {
  const snapshot = await get(ref(db, `users/${uid}`));
  const data: DefaultUserData | null = snapshot.val();
  if (data) {
    return { data };
  }
  return { error: "User with this uid does not exists." };
};

export const getUserCount = (setUserCount: SetCount) => {
  const usersRef = ref(db, "users/");

  return onValue(usersRef, (snapshot) => {
    const data = snapshot.val();
    const userCount = data ? Object.keys(data).length : 0;
    setUserCount(userCount);
  });
};

export const getUserRef = (uid: string) => {
  return ref(db, `${USERS}/${uid}`);
};

export const updateUserData = async (uid: string, data: object) => {
  try {
    const userRef = getUserRef(uid);
    await update(userRef, data);
    return true;
  } catch (error) {
    return false;
  }
};

export const changeUserAvatar = async (userUid: string, avatar: File) => {
  try {
    const storageUserRef = storageRef(storage, `/avatars/${userUid}`);
    await uploadBytes(storageUserRef, avatar);

    const url = await getDownloadURL(storageUserRef);

    await updateUserData(userUid, { avatarUrl: url });
    return url;
  } catch (error) {
    console.error(error);
  }
};

/**
 * Obtains the data for all users
 *
 * @returns {Promise<{[uid: string]: DefaultUserData}>}
 */
export const getUsers = async (): Promise<
  { [uid: string]: DefaultUserData }
> => {
  const req = await get(ref(db, `users`));
  const users = req.val();
  return users;
};
export const getUsersByKey = async (key: string, val: string) => {
  const req = await get(query(usersRef, orderByChild(key)));
  const data = req.val();
  const filteredData = Object.values(data).filter((el) => {
    return (el as DefaultUserData).username.toLowerCase().includes(
      val.toLowerCase(),
    );
  });
  return filteredData;
};

export const setUserDataListen = (
  userUid: string,
  setUserData: SetUserData,
) => {
  const userRef = ref(db, `${USERS}/${userUid}`);
  return onValue(userRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      if (data !== null) {
        setUserData(data);
      }
    }
  });
};
