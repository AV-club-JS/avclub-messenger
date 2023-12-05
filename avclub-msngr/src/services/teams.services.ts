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
import { TEAMS } from "../constants/servicesConstants";

const teamsRef = ref(db, `${TEAMS}/`);

export const getTeamsCount = (setTeamsCount: SetCount) => {

    return onValue(teamsRef, (snapshot) => {
        const data = snapshot.val();
        const teamCount = data ? Object.keys(data).length : 0;
        setTeamsCount(teamCount);
    })
}

export const createTeam = async ({ name, owner, ownerId }: DefaultTeamData) => {
    const uid = crypto.randomUUID();
    await set(ref(db, `${TEAMS}/${uid}`), {
        name,
        owner,
        ownerId,
        teamId: uid,
        members: { ownerId: owner },
        info: '',
        createdOn: Date.now(),
    });
}

export const getTeamInfo = async (teamId: string) => {
    const teamRef = ref(db, `${TEAMS}/${teamId}`);
    const req = await get(teamRef);
    const teamInfo = req.val();
    return teamInfo;
}

export const listenTeamData = (teamId: string, setTeamData: SetTeamData) => {
    const teamRef = ref(db, `${TEAMS}/${teamId}`);
    return onValue(teamRef, (snapshot) => {
        const data = snapshot.val();
        setTeamData(data);
    })
}

export const updateTeamData = async (uid: string, data: object) => {
    const teamRef = ref(db, `${TEAMS}/${uid}`);
    await update(teamRef, data);
    return true;
}