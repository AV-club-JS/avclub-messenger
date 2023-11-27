import { Features } from "../../components/Features";
import { CTA } from "../../components/CTA";
import { ActivityBar } from "../../components/ActivityBar";
import { UserContext } from "../../context/AuthContext";
import { useContext } from "react";
export const Home = () => {
    const { user, userData, setAuth } = useContext(UserContext) 
    console.log(`the user is `, user);
    console.log(userData);
    console.log(setAuth)
    return (
        <>
            <Features />
            <ActivityBar />
            <CTA />
        </>
    )
}
