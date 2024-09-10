import { LOGOUT, USERINFO } from "../actions/ActionType";

interface Identity {
  created_at: string;
  email: string;
  id: string;
  identity_data: any; // Replace 'any' with the appropriate type if known
  identity_id: string;
  last_sign_in_at: string;
  provider: string;
  updated_at: string;
  user_id: string;
}

interface UserMetadata {
  email: string;
  email_verified: boolean;
  name: string;
  phone_verified: boolean;
  sub: string;
}

interface AppMetadata {
  provider: string;
  providers: string[];
}

export interface Users {
  address: string | null;
  app_metadata: AppMetadata;
  aud: string;
  bio: string | null;
  collectedPoints: number | null;
  confirmed_at: string;
  created_at: string;
  email: string | null;
  email_confirmed_at: string;
  id: string;
  identities: Identity[];
  image: string | null;
  is_anonymous: boolean;
  last_sign_in_at: string;
  name: string;
  phonNumber: string | null;
  phone: string;
  role: string;
  updated_at: string;
  user_metadata: UserMetadata;
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
