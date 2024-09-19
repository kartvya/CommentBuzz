import {uploadFile} from './imageServices'
import { supabase } from '../../lib/supabase';

export const createOrUpdatePost = async (post) => {
    try {
        if (post.files && typeof post.files === "object") {
            let isImage = post?.files?.type == "image"
            let folderName = isImage ? "postImages" : "postVideos"
            let fileResult = await uploadFile(folderName, post.files?.uri, isImage)
            if (fileResult?.success) {
               post.files = fileResult?.data
            } else {
               return fileResult
            }
        }

        const { data, error } = await supabase
            .from("posts")
            .upsert(post)
            .select()
            .single()
        if (error) {
            console.log(error);
            return {success:false,data:undefined,msg:error?.message}
        }
            return {success:true,data:data,msg:""}
            
    } catch (error) {
        console.log(error);
        return {success:false,data:undefined,msg:"Could not upload post"}
        
    }
}

export const fetchPost = async (limit = 10) => {
    try {
        const { data, error } = await supabase
            .from("posts")
            .select("*,user:users(id,name,image),postVotes(*)")
            .order("created_at", { ascending: false })
            .limit(limit)
        if (error) {
            console.log(error);
            return {success:false,data:undefined,msg:"Could not fetch post"}    
        }
         return {success:true,data:data,msg:""}
    } catch (error) {
        console.log(error);
        return {success:false,data:undefined,msg:"Could not fetch post"}
    }
}

export const fetchOnlyUserPost = async (limit = 10,userId) => {
     try {
        const { data, error } = await supabase
            .from("posts")
            .select("*,user:users(id,name,image),postVotes(*)")
            .eq("userId", userId)
            .order("created_at", { ascending: false })
            .limit(limit)
        if (error) {
            console.log(error);
            return {success:false,data:undefined,msg:"Could not fetch post"}    
        }
         return {success:true,data:data,msg:""}
    } catch (error) {
        console.log(error);
        return {success:false,data:undefined,msg:"Could not fetch post"}
    }
}

export const createPostUpvote = async (postUpvote) => {
  try {
    const { data: voteData, error: voteError } = await supabase
      .from("postVotes")
      .upsert(postUpvote)
      .select()
      .single();

    if (voteError) {
      console.log(voteError);
      return { success: false, data: undefined, msg: "Could not upvote post" };
    }

    const { error: postError } = await supabase
      .from("posts")
      .update({ voteCount: postUpvote.voteCount })
      .eq("id", postUpvote.postId)
      .select()
      .single();
    if (postError) {
      console.log(postError);
      return { success: false, data: undefined, msg: "Could not update vote count" };
    }

    return { success: true, data: voteData, msg: "" };
  } catch (error) {
    console.log(error);
    return { success: false, data: undefined, msg: "Could not upvote post" };
  }
};

export const deletePostUpvote = async (userId, postId, postVoteCount, feedBuzzCoins) => {
    try {
        const {  error } = await supabase
            .from("postVotes")
            .delete()
            .eq("userId", userId)
            .eq("postId", postId)
        
        if (error) {
            console.log(error);
            return {success:false,data:undefined,msg:"Could not delete post"}    
        }

         const { error: postError } = await supabase
      .from("posts")
      .update({ voteCount: postVoteCount})
      .eq("id", postId)
      .select()
      .single();
    if (postError) {
      console.log(postError);
      return { success: false, data: undefined, msg: "Could not update vote count" };
    }
         return {success:true,data:undefined,msg:""}
    } catch (error) {
        console.log(error);
        return {success:false,data:undefined,msg:"Could not delete  post"}
    }
}