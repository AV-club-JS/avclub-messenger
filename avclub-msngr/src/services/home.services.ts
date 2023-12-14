import { storage } from "../config/firebase-config";
import { HOME_IMAGE_FEATURES, STORAGE_HOME } from "../constants/servicesConstants";
import { ref as storageRef, getDownloadURL } from "firebase/storage";

export const getFeaturesImage = async () => {
    const storageHomeImageRef = storageRef(storage, `/${STORAGE_HOME}/${HOME_IMAGE_FEATURES}`);

    const url = await getDownloadURL(storageHomeImageRef);

    return url;
};

export const getAvatar = async (avatarName: string) => {
    const storageAvatarRef = storageRef(storage, `${STORAGE_HOME}/${avatarName}`);

    const url = await getDownloadURL(storageAvatarRef);

    return url;
}