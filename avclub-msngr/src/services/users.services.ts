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
import { DefaultUserData, SetCount, SetUserDataContext } from "../types/types";
// constants
import { AVATARS, USERS, TEAMIDS } from "../constants/servicesConstants";
import { Unsubscribe } from "firebase/auth";

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
    const storageUserRef = storageRef(storage, `/${AVATARS}/${userUid}`);
    await uploadBytes(storageUserRef, avatar);

    const url = await getDownloadURL(storageUserRef);

    await updateUserData(userUid, { avatarUrl: url });
    return url;
};

export const getUsersByUsername = async (val: string) => {
    const req = await get(query(usersRef));
    const data = req.val();
    const filteredData = Object.values(data).filter((el) => {
        return (el as DefaultUserData).username.toLowerCase().includes(val.toLowerCase())
    });
    return filteredData;
}

export const setUserDataListen = (userUid: string, setUserData: SetUserDataContext) => {
    const userRef = ref(db, `${USERS}/${userUid}`);
    return onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val() as DefaultUserData;
            if (data !== null) {
                setUserData((prevState) => ({
                    ...prevState,
                    userData: data
                }));
            }
        }
    })
}

export const getUsersByTeam = async (teamid: string) => {
    const req = await get(usersRef);
    const data = req.val();
    const users = Object.values(data) as DefaultUserData[];
    const teamUsers = users.filter((user) => {
        const typedUser = user as DefaultUserData;
        if (typedUser.teamIds &&
            typeof typedUser.teamIds === "object" &&
            teamid in typedUser.teamIds) {
            
            return true;
        }
        return false;
    })
    
    return teamUsers;
}

export const getUsersNotInTeam = async (val: string, teamId: string) => {
    const req = await get(query(usersRef));
    const data = req.val();
    const filteredData = Object.values(data).filter((el) => {
        const username = (el as DefaultUserData).username?.toLowerCase();

        if (username && username.includes(val.toLowerCase())) {
            const userTeamIds = (el as DefaultUserData).teamIds;

            if (userTeamIds && Object.keys(userTeamIds).includes(teamId)) {
                return false;
            }

            return true;
        }

        return false;
    });

    return filteredData;
}

export const removeUserTeam = async (userId: string, teamId: string) => {
    const userTeamRef = ref(db, `${USERS}/${userId}/${TEAMIDS}/${teamId}`);
    await remove(userTeamRef);
}

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

export const setUserDataListener = (
  userUid: string,
  setUserData: SetUserDataContext,
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



export const getUsersByUIDs = async (uids: string[]) :Promise<DefaultUserData[]> => {
  try {
    const usersRef = ref(db, "users");
    const requests = uids.map(uid => get(query(usersRef, orderByChild('uid'), equalTo(uid))));
    const resolves = await Promise.all(requests);
    return resolves.map(res => Object.values(res.val())[0]) as DefaultUserData[];
  } catch (error) {
    console.log((error as Error).message);
    return [];
  }
};
