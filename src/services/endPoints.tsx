export const BaseUrl = "http://10.81.104.9:8000/api";
export const endPoints = {
  Login: "/auth/login",
  RefreshToken: "/auth/refresh",
  GetUserProfileDetails: "/user/profile",
  Register: "/auth/register",
  EditProfile: "/user/editProfile",
  CreatePost: "/post/createPost",
  GetAllPost: "/post/getPost",
  ToggleVote: "/post/voteToggle",
  DeletePost: "/post/deletePost",
  GetOnlyUserPost: "/post/getOnlyUserPost",
  GetPostComments: "/comment/getComments",
  CreateComment: "/comment/createComment",
  DeleteComment: "/comment/deleteComment",
  ToggleCommentVote: "/comment/commentVoteToggle",
  GetOnlyUserComments: "/comment/getOnlyUserComments",
};
