import { store } from "../redux/Store";

export const getUserData = async () => {
  try {
    const currentUserInfo = store.getState().root?.authReducer.userInfo;
    if (currentUserInfo && Object.entries(currentUserInfo)?.length > 0) {
      return { success: true, data: currentUserInfo };
    }
    return { success: false };
  } catch (error) {
    console.log(error);
    return { success: false, msg: error };
  }
};

export const updateUser = async (userId: string, data: any) => {
  try {
    // const { error } = await supabase
    //   .from("users")
    //   .update(data)
    //   .eq("id", userId);
    // if (error) {
    //   console.log(error);
    //   return { success: false, data: undefined, msg: error };
    // }
    // return { success: true, data: data, msg: "" };
  } catch (error) {
    console.log(error);
    return { success: false, data: undefined, msg: error };
  }
};
