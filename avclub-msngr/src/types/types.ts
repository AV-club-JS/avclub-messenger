import { Dispatch, ReactElement, SetStateAction } from "react";

export interface FeatureProps {
    text: string
    iconBg: string
    icon?: ReactElement
}
export type ChildrenProps = {
    children: JSX.Element
}
export type DefaultUserData = {
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    phone: string,
    uid?: string,
    avatarUrl?: string
};

export type Credentials = {
    email: string,
    password: string
};

export type AuthContextType = {
    userData: DefaultUserData | null,
    setAuth: Dispatch<SetStateAction<{ userData: null; }>>
} | null;
