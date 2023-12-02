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
  bio?: string;
  status?: string;
  createdOn?: string;
};

export type DefaultTeamData = {
  name: string;
  owner: string;
  uid: string;
  members: object;
  info: string;
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
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

export type Chat = {
  [messageId: string]: {
    messageId: string;
    author: string;
    username: string;
    avatarURL: string;
    content: string;
  };
};

export type ChatInfo = {
  chatId?: string;
  uid: string; // the creator (owner) of the chanel
  name: string;
  owner: string;
  participants: { [uid: string]: number };
  personal: boolean;
  type: "chat" | "chanel";
  messages: Chat;
  createdOn: number;
};

export type ChatsCollection = ChatInfo[];
