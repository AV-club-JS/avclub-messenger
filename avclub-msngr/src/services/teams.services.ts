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
import { SetCount } from "../types/types";

export const getTeamsCount = (setTeamsCount: SetCount) => {
    const teamsRef = ref(db, 'teams/');
    
    return onValue(teamsRef, (snapshot) => {
        const data = snapshot.val();
        const teamCount = data ? Object.keys(data).length : 0; 
        setTeamsCount(teamCount);
    })
}