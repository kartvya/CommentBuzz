import AsyncStorage from '@react-native-async-storage/async-storage';
import {endPoints} from '../ApiEndpoints';
import backendBaseApi from '../BackendBaseApi';
import {USERINFO} from '../../redux/actions/ActionType';

interface LoginPayload {
  email: string;
  password: string;
}

interface CommonResponse<T> {
  id: string;
  jsonrpc: string;
  result: T;
}

export interface User {
  company_id: any[];
  email: string;
  id: number;
  login: string;
  name: string;
  phone: boolean;
}

interface UserData {
  status: string;
  token: string;
  user: User[];
}

const AuthApi = backendBaseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: build => ({
    login: build.mutation<CommonResponse<UserData>, LoginPayload>({
      query: payload => ({
        url: endPoints.login,
        method: 'POST',
        body: payload,
      }),
      async onQueryStarted(payload, {dispatch, queryFulfilled}) {
        try {
          const {data: userData} = await queryFulfilled;
          if (userData.result.token) {
            await AsyncStorage.setItem('UserToken', userData.result.token);
            dispatch({
              type: USERINFO,
              payload: {
                userInfo: userData.result?.user,
                hasToken: true,
                accessToken: userData.result.token,
              },
            });
          } else {
            console.log('Login api error');
          }
        } catch {
          console.log('error');
        }
      },
    }),
  }),
});

export const {useLoginMutation} = AuthApi;
