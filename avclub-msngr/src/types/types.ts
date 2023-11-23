import { ReactElement } from "react";

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
    password: string,
    firstName: string,
    lastName: string,
    phone: string,
};

export type UserLoginData = {
  email: string,
  password: string
};
