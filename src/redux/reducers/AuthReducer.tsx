import { ISDARKMODE, LOGOUT, USERINFO } from "../actions/ActionType";
export interface UserInfo {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  gender?: string;
  profilePic: string;
  bio: string;
  buzzCoins: number;
  followers: string[];
  following: string[];
}

export interface AuthState {
  userInfo: UserInfo | null;
  isDarkMode: boolean;
}

export interface AuthAction {
  type: string;
  payload?: any;
}

const initialState: AuthState = {
  userInfo: null,
  isDarkMode: true,
};

export const authReducer = (
  state: AuthState = initialState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case USERINFO:
      return {
        ...state,
        userInfo: action.payload,
      };
    case ISDARKMODE:
      return {
        ...state,
        isDarkMode: action.payload,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};
