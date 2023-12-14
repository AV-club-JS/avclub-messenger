import { ref, update } from "firebase/database";
import { DYTE_URL, ENCODED_STR } from "../constants/dyteConstants";
import { CHANNELS } from "../constants/servicesConstants";
import { db } from "../config/firebase-config";

export const dyteRoomCreate = async (title: string) => {
    const response = await fetch(`${DYTE_URL}/meetings`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            Authorization: `Basic ${ENCODED_STR}`,
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            title: `${title}`
        })
    });

    return response;
}

export const addRoomID = async (chatId: string, roomId: string) => {
    if (chatId && roomId) {
        const updateData = {
            [`${CHANNELS}/${chatId}/roomId`]: roomId,
        };

        await update(ref(db), updateData);
    }
};
