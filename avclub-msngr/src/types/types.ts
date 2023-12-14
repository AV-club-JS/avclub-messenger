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
    chatids: {[chatId: string]: number},
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
    teamId: string,
    members: object,
    info: string,
    createdOn: string
    channelIds: object
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
  nav: string;
}

export interface UserDataProps {
    users: DefaultUserData[];
}

export type SetUserDataContext = Dispatch<SetStateAction<AppState>>;

export type UserTeams = {
    name: string
    teamId: string
}

export type SetTeamData = Dispatch<SetStateAction<DefaultTeamData>>;

export interface TeamsDisplayProps {
    teams: DefaultTeamData[];
}

export interface CreateTeamValues {
    teamName: string;
    info: string;
}

export type HandleDeleteFunction = () => Promise<void>;

export type HandleSearchOpenFunction = () => void;

export interface TeamButtonsProps {
    handleDelete: HandleDeleteFunction;
    handleSearchOpen: HandleSearchOpenFunction;
}
export type Chat = {
  [messageId: string]: MessageInfo
};

export type ChatInfo = {
  name: string;
  chatId?: string;
  uid: string; // the creator (owner) of the channel
  participants: {
    [uid: string]: {
      unread: number;
      sent: number;
      received: number;
    };
  };
  personal: boolean;
  type: "chat" | "channel";
  messages?: Chat;
  createdOn: number;
  affiliatedTeam?: string;
  roomId?: string
};

export type ChatsCollection = ChatInfo[];
export interface SearchResultsProps {
  users: DefaultUserData[];
  onClose: () => void;
  chatId?: string; 
}

export type SetUserData = Dispatch<SetStateAction<DefaultUserData | null>>;
export type SetUsersData = Dispatch<SetStateAction<DefaultUserData []| []>>;

export type SetChats = Dispatch<SetStateAction<ChatInfo[] | null>>;

export type MessageInfo = {
  uid: string;
  messageId: string;
  createdOn: number;
  content: string;
  reactions?: {
    [symbol: string]: {
      [uid: string]: number; 
    }
  }
  edited?: boolean;
};

export type SetMessages = Dispatch<SetStateAction<MessageInfo[]>>;

export type Participants = {
  [key: string]: number;
};

export interface ChannelListProps {
  channelArr: ChatsCollection;
  isOwner: boolean;
}

export interface FetchDataResponse {
  chatInfo?: ChatInfo;
  error?: string;
}

