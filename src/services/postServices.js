import { uploadFile } from "./imageServices";
import { useLazyGetPostQuery } from "./PostReqest/postApi";

const usePostServices = () => {
  const [getUserPost] = useLazyGetPostQuery();
  const createOrUpdatePost = async (post) => {
    try {
      if (post.files && typeof post.files === "object") {
        let isImage = post?.files?.type === "image";
        let folderName = isImage ? "postImages" : "postVideos";
        let fileResult = await uploadFile(folderName, post.files?.uri, isImage);
        if (fileResult?.success) {
          post.files = fileResult?.data;
        } else {
          return fileResult;
        }
      }

      if (error) {
        console.log(error);
        return { success: false, data: undefined, msg: error?.message };
      }
      return { success: true, data: data, msg: "" };
    } catch (error) {
      console.log(error);
      return { success: false, data: undefined, msg: "Could not upload post" };
    }
  };

  const deletePost = async (postDeleteObj) => {
    try {
      if (error) {
        console.log(error);
        return {
          success: false,
          data: undefined,
          msg: "Could not delete post",
        };
      }
      return {
        success: true,
        data: undefined,
        msg: "Post successfully deleted",
      };
    } catch (error) {
      console.log(error);
      return { success: false, data: undefined, msg: error?.message };
    }
  };

  const fetchPost = async (limit = 10) => {
    try {
      const res = await getUserPost(limit).unwrap();
      if (res.success) {
        return { success: true, data: res.data, msg: "" };
      } else {
        console.log(error);
        return { success: false, data: undefined, msg: "Could not fetch post" };
      }
    } catch (error) {
      console.log(error);
      return { success: false, data: undefined, msg: "Could not fetch post" };
    }
  };

  const fetchPostDetails = async (postId) => {
    try {
      if (error) {
        console.log(error);
        return {
          success: false,
          data: undefined,
          msg: "Could not fetch post details",
        };
      }
      return { success: true, data: data, msg: "" };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        data: undefined,
        msg: "Could not fetch post details",
      };
    }
  };

  const fetchOnlyUserPost = async (limit = 10, userId) => {
    try {
      console.log(limit);
      if (error) {
        console.log(error);
        return { success: false, data: undefined, msg: "Could not fetch post" };
      }
      return { success: true, data: data, msg: "" };
    } catch (error) {
      console.log(error);
      return { success: false, data: undefined, msg: "Could not fetch post" };
    }
  };

  const createPostUpvote = async (postUpvote) => {
    try {
      if (voteError) {
        console.log(voteError);
        return {
          success: false,
          data: undefined,
          msg: "Could not upvote post",
        };
      }

      if (postError) {
        console.log(postError);
        return {
          success: false,
          data: undefined,
          msg: "Could not update vote count",
        };
      }

      return { success: true, data: voteData, msg: "" };
    } catch (error) {
      console.log(error);
      return { success: false, data: undefined, msg: "Could not upvote post" };
    }
  };

  const deletePostUpvote = async (deleteObj) => {
    try {
      if (error) {
        console.log(error);
        return {
          success: false,
          data: undefined,
          msg: "Could not delete post",
        };
      }

      if (postError) {
        console.log(postError);
        return {
          success: false,
          data: undefined,
          msg: "Could not update vote count",
        };
      }
      return { success: true, data: undefined, msg: "" };
    } catch (error) {
      console.log(error);
      return { success: false, data: undefined, msg: "Could not delete post" };
    }
  };

  const createComment = async (comment) => {
    try {
      if (commentError) {
        console.log(commentError);
        return {
          success: false,
          data: undefined,
          msg: "Could not comment post",
        };
      }

      return { success: true, data: voteData, msg: "" };
    } catch (error) {
      console.log(error);
      return { success: false, data: undefined, msg: "Could not comment post" };
    }
  };

  const deleteComment = async (commentId) => {
    try {
      if (commentError) {
        console.log(commentError);
        return {
          success: false,
          data: undefined,
          msg: "Could not delete comment",
        };
      }

      return { success: true, data: { commentId }, msg: "" };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        data: undefined,
        msg: "Could not delete comment",
      };
    }
  };

  const createCommentVote = async (commentVote) => {
    try {
      if (voteError || !voteData) {
        console.log(
          voteError || "Error: No data returned from upsert",
          "voteError"
        );
        return {
          success: false,
          data: undefined,
          msg: "Could not upvote post",
        };
      } else {
        console.log("Vote inserted or updated successfully.");
      }

      if (postError) {
        console.log(postError);
        return {
          success: false,
          data: undefined,
          msg: "Could not update vote count",
        };
      }

      return { success: true, data: voteData, msg: "" };
    } catch (error) {
      console.log(error);
      return { success: false, data: undefined, msg: "Could not upvote post" };
    }
  };

  const deleteCommentVote = async (deleteObj) => {
    try {
      if (error) {
        console.log(error);
        return {
          success: false,
          data: undefined,
          msg: "Could not delete post",
        };
      }

      if (postError) {
        console.log(postError);
        return {
          success: false,
          data: undefined,
          msg: "Could not update vote count",
        };
      }
      return { success: true, data: undefined, msg: "" };
    } catch (error) {
      console.log(error);
      return { success: false, data: undefined, msg: "Could not delete post" };
    }
  };

  const fetchOnlyUserComments = async (limit = 10, userId) => {
    try {
      if (error) {
        console.log(error);
        return { success: false, data: undefined, msg: "Could not fetch post" };
      }
      return { success: true, data: data, msg: "" };
    } catch (error) {
      console.log(error);
    }
  };

  return {
    createOrUpdatePost,
    deletePost,
    fetchPost,
    fetchPostDetails,
    fetchOnlyUserPost,
    createPostUpvote,
    deletePostUpvote,
    createComment,
    deleteComment,
    createCommentVote,
    deleteCommentVote,
    fetchOnlyUserComments,
  };
};

export default usePostServices;
