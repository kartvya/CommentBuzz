import { LOGOUT, USERINFO } from "../actions/ActionType";

interface UserIdentity {
  created_at: string;
  email: string;
  id: string;
  identity_data: Record<string, unknown>;
  identity_id: string;
  last_sign_in_at: string;
  provider: string;
  updated_at: string;
  user_id: string;
}

interface UserAppMetadata {
  provider: string;
  providers: string[];
}

interface UserMetadata {
  email: string;
  email_verified: boolean;
  name: string;
  phone_verified: boolean;
  sub: string;
}
export interface Users {
  address: string;
  app_metadata: UserAppMetadata;
  aud: string;
  bio: string;
  buzzCoins: number | null;
  confirmed_at: string;
  created_at: string;
  email: string;
  email_confirmed_at: string;
  id: string;
  identities: UserIdentity[];
  image: string;
  is_anonymous: boolean;
  last_sign_in_at: string;
  name: string;
  phonNumber: string;
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
