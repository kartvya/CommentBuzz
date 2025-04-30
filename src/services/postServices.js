import { uploadFile } from "./imageServices";

export const createOrUpdatePost = async (post) => {
  try {
    if (post.files && typeof post.files === "object") {
      let isImage = post?.files?.type == "image";
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

export const deletePost = async (postDeleteObj) => {
  try {
    if (error) {
      console.log(error);
      return { success: false, data: undefined, msg: "Could not delete post" };
    }
    return { success: true, data: undefined, msg: "Post successfully deleted" };
  } catch (error) {
    console.log(error);
    return { success: false, data: undefined, msg: error?.message };
  }
};

export const fetchPost = async (limit = 10) => {
  try {
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

export const fetchPostDetails = async (postId) => {
  try {
    if (error) {
      console.log(error);
      return {
        success: false,
        data: undefined,
        msg: "Could not fetch postdetails",
      };
    }
    return { success: true, data: data, msg: "" };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: undefined,
      msg: "Could not fetch postdetails",
    };
  }
};

export const fetchOnlyUserPost = async (limit = 10, userId) => {
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

export const createPostUpvote = async (postUpvote) => {
  try {
    if (voteError) {
      console.log(voteError);
      return { success: false, data: undefined, msg: "Could not upvote post" };
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

export const deletePostUpvote = async (deleteObj) => {
  try {
    if (error) {
      console.log(error);
      return { success: false, data: undefined, msg: "Could not delete post" };
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
    return { success: false, data: undefined, msg: "Could not delete  post" };
  }
};

export const createComment = async (comment) => {
  try {
    if (commentError) {
      console.log(commentError);
      return { success: false, data: undefined, msg: "Could not comment post" };
    }

    return { success: true, data: voteData, msg: "" };
  } catch (error) {
    console.log(error);
    return { success: false, data: undefined, msg: "Could not comment post" };
  }
};

export const deleteComment = async (commentId) => {
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
    return { success: false, data: undefined, msg: "Could not delete comment" };
  }
};

// comment add votes
export const createCommentVote = async (commentVote) => {
  try {
    if (voteError || !voteData) {
      console.log(
        voteError || "Error: No data returned from upsert",
        "voteError"
      );
      return { success: false, data: undefined, msg: "Could not upvote post" };
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

export const deleteCommentVote = async (deleteObj) => {
  try {
    if (error) {
      console.log(error);
      return { success: false, data: undefined, msg: "Could not delete post" };
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
    return { success: false, data: undefined, msg: "Could not delete  post" };
  }
};

export const fetchOnlyUserComments = async (limit = 10, userId) => {
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
