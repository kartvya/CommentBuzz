import { ALLPOST, DISLIKEPOST, LIKEPOST, LOGOUT } from "../actions/ActionType";

export interface FeedState {
  Post: any[];
}

export interface CommunityAction {
  type: string;
  payload?: any;
}

const initialState: FeedState = {
  Post: [],
};

export const FeedReducer = (
  state: FeedState = initialState,
  action: CommunityAction
) => {
  switch (action.type) {
    case ALLPOST:
      return {
        ...state,
        Post: action.payload,
      };
    case LIKEPOST:
      return {
        ...state,
        Post: state.Post.map((post) =>
          post.id === action.payload
            ? { ...post, likes: post.likes + 1, is_liked: true }
            : post
        ),
      };
    case DISLIKEPOST:
      return {
        ...state,
        Post: state.Post.map((post) =>
          post.id === action.payload
            ? { ...post, likes: post.likes - 1, is_liked: false }
            : post
        ),
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};
