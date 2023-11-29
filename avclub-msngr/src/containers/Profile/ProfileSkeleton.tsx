"use strict";

import { DefaultUserData } from "../../types/types";
import {Box, Skeleton, Avatar } from "@chakra-ui/react";

export const ProfileSkeleton = (props: { user: DefaultUserData }) => {
  // destructure the user data from the firebase.
  const { user } = props;
  // get the chats ids
  return (
    <>
      <Box>
         
        <Skeleton isLoaded={false}>
          hello
        </Skeleton>
      </Box>
    </>
  );
};
