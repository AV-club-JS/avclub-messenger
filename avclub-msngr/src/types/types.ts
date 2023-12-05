import { Dispatch, ReactElement, SetStateAction } from "react";
import { User } from "firebase/auth";

export interface FeatureProps {
    text: string;
    iconBg: string;
    icon?: ReactElement;
}

export type ChildrenProps = {
    children: JSX.Element;
};

export type DefaultUserData = {
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    phone: string,
    uid: string,
    avatarUrl: string,
    bio: string,
    status: string,
    createdOn: string,
    teamIds?: object
};

export type DefaultTeamData = {
    name: string,
    owner: string,
    ownerId: string,
    teamId: string,
    members: object,
    info: string,
    createdOn: string
};

export type Credentials = {
    email: string;
    password: string;
};

export interface AppState {
    user: null | User | undefined;
    userData: DefaultUserData | null;
}

export interface AuthContext extends AppState {
    setAuth: Dispatch<SetStateAction<AppState>>;
}

export type SetCount = Dispatch<SetStateAction<number>>;

export interface ActivityBarProps {
    users: number;
    teams: number;
}

export interface NavItem {
    label: string
    nav: string
}

export interface UserDataProps {
    users: DefaultUserData[];
}

export type SetUserData = Dispatch<SetStateAction<AppState>>;

export type UserTeams = {
    name: string
    teamId: string
}

export type SetTeamData = Dispatch<SetStateAction<DefaultTeamData>>;

export interface TeamsDisplayProps {
    teams: DefaultTeamData[];
}