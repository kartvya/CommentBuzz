import { uploadFile } from "./imageServices";
import { supabase } from "../../lib/supabase";

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

    const { data, error } = await supabase
      .from("posts")
      .upsert(post)
      .select()
      .single();
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
     const { error } = await supabase
      .from("posts")
      .delete()
      .eq("userId", postDeleteObj?.userId)
      .eq("id", postDeleteObj?.postId);

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
    const { data, error } = await supabase
      .from("posts")
      .select("*,user:users(id,name,image),postVotes(*),comments(count)")
      .order("created_at", { ascending: false })
      .limit(limit);
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
    const { data, error } = await supabase
      .from("posts")
      .select("*,user:users(id,name,image),postVotes(*),commentVotes(*),comments(*,user:users(id,name,image))")
      .eq("id", postId)
      .order("created_at", {ascending:true,foreignTable:'comments'})
      .single()
    if (error) {
      console.log(error);
      return { success: false, data: undefined, msg: "Could not fetch postdetails" };
    }
    return { success: true, data: data, msg: "" };
  } catch (error) {
    console.log(error);
    return { success: false, data: undefined, msg: "Could not fetch postdetails" };
  }
};

export const fetchOnlyUserPost = async (limit = 10, userId) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*,user:users(id,name,image),postVotes(*),comments(count)")
      .eq("userId", userId)
      .order("created_at", { ascending: false })
      .limit(limit);
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
    const { data: voteData, error: voteError } = await supabase
      .from("postVotes")
      .upsert({
        userId: postUpvote?.userId,
        postId: postUpvote?.postId,
        voteType: postUpvote?.voteType,
        voteCount: postUpvote?.voteCount,
      })
      .select()
      .single();

    if (voteError) {
      console.log(voteError);
      return { success: false, data: undefined, msg: "Could not upvote post" };
    }

    const { error: postError } = await supabase
      .from("posts")
      .update({
        voteCount: postUpvote.voteCount,
        postBuzz: postUpvote.feedBuzzCoins,
      })
      .eq("id", postUpvote.postId)
      .select()
      .single();
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
    const { error } = await supabase
      .from("postVotes")
      .delete()
      .eq("userId", deleteObj?.userId)
      .eq("postId", deleteObj?.postId);

    if (error) {
      console.log(error);
      return { success: false, data: undefined, msg: "Could not delete post" };
    }

    const { error: postError } = await supabase
      .from("posts")
      .update({
        voteCount: deleteObj?.voteCount,
        postBuzz: deleteObj?.feedBuzzCoins,
      })
      .eq("id", deleteObj?.postId)
      .select()
      .single();
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
    const { data: voteData, error: commentError } = await supabase
      .from("comments")
      .insert(comment)
      .select()
      .single();

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
    const {  error: commentError } = await supabase
      .from("comments")
      .delete()
      .eq("id",commentId)

    if (commentError) {
      console.log(commentError);
      return { success: false, data: undefined, msg: "Could not delete comment" };
    }

    return { success: true, data: {commentId}, msg: "" };
  } catch (error) {
    console.log(error);
    return { success: false, data: undefined, msg: "Could not delete comment" };
  }
};

// comment add votes
export const createCommentVote = async (commentVote) => {
  try {
    const { data: voteData, error: voteError } = await supabase
      .from("commentsVotes")
      .insert({
        commentId: commentVote?.commentId,
        userId: commentVote?.userId,
        voteType: commentVote?.voteType,
        voteCount: commentVote?.voteCount,
        postId: commentVote?.postId,
      })
      .select()
      .single();     
    if (voteError) {
      console.log(voteError.message,'voteErrovoteErrorr');
      return { success: false, data: undefined, msg: "Could not upvote post" };
    } else {
      console.log("updated")
    }

    const { error: postError } = await supabase
      .from("comments")
      .update({
        voteCount: commentVote.voteCount,
        commentBuzz: commentVote.feedBuzzCoins,
      })
      .eq("id", commentVote.commentId)
      .select()
      .single();
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
    const { error } = await supabase
      .from("commentsVotes")
      .delete()
      .eq("userId", deleteObj?.userId)
      .eq("postId", deleteObj?.postId);

    if (error) {
      console.log(error);
      return { success: false, data: undefined, msg: "Could not delete post" };
    }

    // const { error: postError } = await supabase
    //   .from("posts")
    //   .update({
    //     voteCount: deleteObj?.voteCount,
    //     postBuzz: deleteObj?.feedBuzzCoins,
    //   })
    //   .eq("id", deleteObj?.postId)
    //   .select()
    //   .single();
    // if (postError) {
    //   console.log(postError);
    //   return {
    //     success: false,
    //     data: undefined,
    //     msg: "Could not update vote count",
    //   };
    // }

    return { success: true, data: undefined, msg: "" };
  } catch (error) {
    console.log(error);
    return { success: false, data: undefined, msg: "Could not delete  post" };
  }
};
