import {Alert} from 'react-native';
import {ImagePayload} from '../../components/comunitymessage/ComunityFotter';
import {ALLPOST} from '../../redux/actions/ActionType';
import {endPoints} from '../ApiEndpoints';
import backendBaseApi from '../BackendBaseApi';

interface UploadPayload {
  descriptionText: string;
  file: ImagePayload | undefined;
}

interface PostActionPayload {
  post_id: number;
}

interface CommonResponse<T> {
  id: string;
  jsonrpc: string;
  result: T;
}

interface SuccesfullImageUploadPayload {
  post_id: number;
  status: string;
}

export interface PostInfo {
  id: number;
  image: string;
  description: string;
  user_id: any[];
  timestamp: string;
  likes: number;
  is_liked: boolean;
  owner: string;
}

export interface PostData {
  posts: PostInfo[];
}

const CommunityApi = backendBaseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: build => ({
    getAllPost: build.query<CommonResponse<PostData>, void>({
      query: () => ({
        url: endPoints.getPost,
        method: 'Get',
      }),
      keepUnusedDataFor: 0,
      async onQueryStarted(payload, {dispatch, queryFulfilled}) {
        try {
          const {data: postData} = await queryFulfilled;

          if (postData.result?.posts) {
            dispatch({type: ALLPOST, payload: postData.result.posts});
          } else {
            console.log('Get post api error');
          }
        } catch (error) {
          console.log('error', error);
        }
      },
    }),
    uploadPost: build.mutation<
      CommonResponse<SuccesfullImageUploadPayload>,
      UploadPayload
    >({
      query: ({descriptionText, file}) => {
        const body = new FormData();
        const profilePhoto = {
          uri: file?.uri,
          type: file?.type || 'image/jpeg',
          name: file?.fileName || 'profile_photo.jpg',
        };
        body.append('description', descriptionText);
        body.append('image', profilePhoto);
        return {
          url: endPoints.uploadPost,
          method: 'POST',
          body,
          headers: {
            'Content-Type': `multipart/form-data`,
          },
        };
      },
    }),
    likePost: build.mutation<CommonResponse<any>, PostActionPayload>({
      query: payload => ({
        url: endPoints.likePost,
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const {useGetAllPostQuery, useUploadPostMutation, useLikePostMutation} =
  CommunityApi;
