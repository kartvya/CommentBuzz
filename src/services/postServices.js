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
            .select("*,user:users(id,name,image)")
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