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
import { SetCount, SetTeamData } from "../types/types";
// constants
import { CHANNELS, PARTICIPANTS, TEAMS, USERS } from "../constants/servicesConstants";
// services
import { getChatInfo } from ".";

const teamsRef = ref(db, `${TEAMS}/`);

export const getTeamsCount = (setTeamsCount: SetCount) => {

    return onValue(teamsRef, (snapshot) => {
        const data = snapshot.val();
        const teamCount = data ? Object.keys(data).length : 0;
        setTeamsCount(teamCount);
    })
}

export const createTeam = async (name: string, ownerId: string, info: string) => {
    const uid = crypto.randomUUID();
    await set(ref(db, `${TEAMS}/${uid}`), {
        name,
        owner: ownerId,
        info,
        teamId: uid,
        members: { [ownerId]: Date.now() },
        createdOn: Date.now(),
    });

    await addUserToTeam(ownerId, uid);
    return uid;
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
        return () => { };
    }
}

export const updateTeamData = async (uid: string, data: object) => {
    const teamRef = ref(db, `${TEAMS}/${uid}`);
    await update(teamRef, data);
    return true;
}

export const addUserToTeam = async (userId: string, teamId: string) => {
    const userRef = ref(db, `${USERS}/${userId}/teamIds`);
    const teamRef = ref(db, `${TEAMS}/${teamId}/members`);
    const dataForTeam = { [userId]: Date.now() };
    const dataForUser = { [teamId]: Date.now() };
    await update(userRef, dataForUser);
    await update(teamRef, dataForTeam);
}

export const doesTeamNameExist = async (teamName: string) => {
    const req = await get(query(teamsRef, orderByChild('name'), equalTo(teamName)));
    const data = req.val();

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
    await remove(userRef);
    await remove(teamRef);
}

export const createTeamChannel = async (
    teamId: string,
    channelName: string,
    privateStatus: boolean,
    ownerId: string,
    participants: object
) => {
    const channelId = crypto.randomUUID();
    let channelMembers;

    if (privateStatus) {
        channelMembers = { [ownerId]: Date.now() };
    } else {
        channelMembers = participants;
    }

    const teamChannelIdRef = ref(db, `${TEAMS}/${teamId}/channelIds/${channelId}`);
    const teamChannelUpdate = { [`${channelId}`]: Date.now() };
    await set(ref(db, `${CHANNELS}/${channelId}`), {
        name: channelName,
        chatId: channelId,
        personal: privateStatus,
        uid: ownerId,
        createdOn: Date.now(),
        type: 'channel',
        participants: channelMembers,
        affiliatedTeam: teamId
    })
    await update(teamChannelIdRef, teamChannelUpdate);
    
    return channelId;
}

export const deleteTeamChannel = async (teamId: string, channelId: string) => {
    const teamChannelIdRef = ref(db, `${TEAMS}/${teamId}/channelIds/${channelId}`);
    const channelRef = ref(db, `${CHANNELS}/${channelId}`);
    await remove(teamChannelIdRef);
    await remove(channelRef);
    return true;
}

export const getTeamChannels = async (channelKeys: string[]) => {
    const result = [];
    for (const channelKey of channelKeys) {

        const chat = await getChatInfo(channelKey);
        if (chat && chat.chatInfo) {
            result.push(chat.chatInfo);
        }
    }
    return result;
}

export const addUserToTeamChannel = async (userId: string, channelId: string) => {
    const channelRef = ref(db, `${CHANNELS}/${channelId}/${PARTICIPANTS}`);
    const dataForChannel = { [userId]: Date.now() };
    await update(channelRef, dataForChannel);
}