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
// database
import { db } from "../config/firebase-config";
// types
import { SetCount, DefaultTeamData, SetTeamData } from "../types/types";
// constants
import { TEAMS, USERS } from "../constants/servicesConstants";
// services
import { updateUserData } from ".";

const teamsRef = ref(db, `${TEAMS}/`);

export const getTeamsCount = (setTeamsCount: SetCount) => {

    return onValue(teamsRef, (snapshot) => {
        const data = snapshot.val();
        const teamCount = data ? Object.keys(data).length : 0;
        setTeamsCount(teamCount);
    })
}

export const createTeam = async ( name: string, ownerId: string, info: string ) => {
    const uid = crypto.randomUUID();
    await set(ref(db, `${TEAMS}/${uid}`), {
        name,
        owner: ownerId,
        info,
        teamId: uid,
        members: { [`${ownerId}`]: true },
        createdOn: Date.now(),
    });

    await addUserToTeam(ownerId, uid);
}

export const getTeamInfo = async (teamId: string) => {
    const teamRef = ref(db, `${TEAMS}/${teamId}`);
    const req = await get(teamRef);
    const teamInfo = req.val();
    return teamInfo;
}

export const listenTeamData = (teamId: string, setTeamData: SetTeamData) => {
    const teamRef = ref(db, `${TEAMS}/${teamId}`);
    try {
        const unsubscribe = onValue(teamRef, (snapshot) => {
            const data = snapshot.val();
            setTeamData(data);
        });
        return unsubscribe;
    } catch (error) {
        return () => {};
    }
}

export const updateTeamData = async (uid: string, data: object) => {
    const teamRef = ref(db, `${TEAMS}/${uid}`);
    await update(teamRef, data);
    return true;
}

export const addUserToTeam = async (userId: string, teamId: string) => {
    const teamRef = ref(db, `${TEAMS}/${teamId}/members`);
    const userRef = ref(db, `${USERS}/${userId}/teamIds`);
    const dataForTeam = { [`${userId}`]: true };
    const dataForUser = { [`${teamId}`]: true};
    await update(teamRef, dataForTeam);
    await update(userRef, dataForUser);
}

export const doesTeamNameExist = async (teamName: string) => {
    const req = await get(query(teamsRef, orderByChild('name'), equalTo(teamName)));
    const data = req.val();
    console.log(data);
    if (data === null) {
        return false;
    }
    return true;
}

export const deleteTeam = async (teamId: string) => {
    const teamRef = ref(db, `${TEAMS}/${teamId}`);
    await remove(teamRef);
}

export const removeUserFromTeam = async (teamId: string, userId: string) => {
        const teamRef = ref(db, `${TEAMS}/${teamId}/members/${userId}`);
        const userRef = ref(db, `${USERS}/${userId}/teamIds/${teamId}`);
        await remove(teamRef);
        await remove(userRef);
}
