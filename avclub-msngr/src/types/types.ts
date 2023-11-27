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
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  uid?: string;
  avatarUrl?: string;
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
