"use strict";
import { useContext, useEffect, useState } from "react";
import { DefaultUserData } from "../../types/types";
import { UserContext } from "../../context/AuthContext.tsx";
import { ProfileSkeleton } from "./ProfileSkeleton.tsx";
export const Profile = () => {
  const {userData} = useContext(UserContext);
  return <ProfileSkeleton user={userData as DefaultUserData} />
};
