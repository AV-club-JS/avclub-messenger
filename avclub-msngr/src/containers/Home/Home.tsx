import { useEffect, useState } from "react";
// components
import { Features } from "../../components/Features";
import { CTA } from "../../components/CTA";
import { ActivityBar } from "../../components/ActivityBar";
import { Footer } from "../../components/Footer";
// services
import { getTeamsCount, getUserCount } from "../../services";
import { Unsubscribe } from "firebase/database";
export const Home = () => {
  const [userCount, setUserCount] = useState(-1);
  const [teamsCount, setTeamsCount] = useState(-1);

  useEffect(() => {
    let disconnectUsersListener: Unsubscribe;
    let disconnectTeamsListener: Unsubscribe;

    try {
      disconnectUsersListener = getUserCount(setUserCount);
      disconnectTeamsListener = getTeamsCount(setTeamsCount);
    } catch (error) {
      console.error(error);
    }

    return () => {
      disconnectTeamsListener();
      disconnectUsersListener();
    };
  }, []);

  return (
    <>
      <Features />
      <ActivityBar users={userCount} teams={teamsCount} />
      <CTA />
      <Footer />
    </>
  );
};
