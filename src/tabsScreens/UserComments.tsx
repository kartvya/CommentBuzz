import { StyleSheet, View } from "react-native";
import { TitleText } from "../components/Text";
import { Colors } from "../constants/Colors";
import { memo, useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { fetchOnlyUserComments } from "../services/postServices";
import { useSelector } from "react-redux";
import { RootState } from "../redux/Store";
import { Users } from "../redux/reducers/AuthReducer";

let limit = 10;
const UserComments = () => {
  const isFocused = useIsFocused();
  const UserInfo = useSelector(
    (state: RootState) => state.root?.authReducer?.userInfo
  ) as Users;
  const [comments, setAllComments] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    getAllComments();
  }, [isFocused]);

  const getAllComments = async () => {
    try {
      limit = limit + 10;
      const res = await fetchOnlyUserComments(limit, UserInfo?.id);
      if (res?.success) {
        // Ensure res.data is defined before checking its length
        const postsData = res.data ?? [];

        if (postsData.length > 0 && postsData.length <= 10) {
          setHasMore(false);
          // Remove duplicates if needed
          setAllComments((prevPosts) => {
            const uniquePosts = [
              ...new Map(
                [...prevPosts, ...postsData].map((post) => [post.id, post])
              ).values(),
            ];
            return uniquePosts;
          });
        } else {
          if (postsData.length === comments.length) {
            setHasMore(false);
          }
          setAllComments(postsData);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TitleText style={{ color: Colors.icon, textAlign: "center" }}>
        Comming soon...
      </TitleText>
    </View>
  );
};

export default memo(UserComments);

const styles = StyleSheet.create({});
