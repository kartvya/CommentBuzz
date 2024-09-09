import { LOGOUT, USERINFO } from "../actions/ActionType";

export interface Users {
  address: string;
  bio: string;
  collectedPoints: string;
  created_at: string;
  email: string;
  id: string;
  image: string;
  name: string;
  phonNumber: string;
}
export interface AuthState {
  hasToken: boolean;
  accessToken: string;
  userInfo: any;
}

export interface AuthAction {
  type: string;
  payload?: any;
}

const initialState = {
  hasToken: false,
  accessToken: "",
  userInfo: "",
};

export const authReducer = (
  state: AuthState = initialState,
  action: AuthAction
) => {
  switch (action.type) {
    case USERINFO:
      return {
        ...state,
        userInfo: action.payload.userInfo,
        hasToken: action.payload.hasToken,
        accessToken: action.payload.accessToken,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};
