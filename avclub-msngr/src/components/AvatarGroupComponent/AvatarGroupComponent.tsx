"use strict";
import { DefaultUserData } from "../../types/types";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";
import { getStatusBadgeColor } from "../../utils/profileUtils";

export const AvatarGroupComponent = (
  { max, users }: {
    max: number;
    users: DefaultUserData[] | [];
  },
) => {
  return (
    <AvatarGroup size="md" max={max}>
      {users.map((user) => (
        <Avatar key={user.uid} name={user.username} src={user.avatarUrl}>
          <AvatarBadge boxSize="1.1em" bg={getStatusBadgeColor(user.status)} />
        </Avatar>
      ))}
    </AvatarGroup>
  );
};
