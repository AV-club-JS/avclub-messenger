"use strict";

import { DefaultUserData } from "../../types/types";
import { Skeleton } from "@chakra-ui/react";

export const ProfileSkeleton = (props: {user: DefaultUserData}) => (
  <Skeleton isLoaded={false}>
    hello
  </Skeleton>
);
