import { UserContext } from "../../context/AuthContext";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { Profile, ProfileView } from ".";

export const ProfileWrapper = () => {
    const { userData } = useContext(UserContext);   
    const { userId } = useParams();
    
    if (userData!.uid == userId) {
        return <Profile />
    } else {
        return <ProfileView />
    }
}