import { FlatList, ListRenderItem, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { PostData } from "../utility/types";
import MemoizedPostView from "../components/MemoizedPostView";
import { fetchOnlyUserPost, fetchPost } from "../services/postServices";
import { Colors } from "../constants/Colors";
import { RefreshControl } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { RootState } from "../redux/Store";
import { Users } from "../redux/reducers/AuthReducer";
import { TitleText } from "../components/Text";
let limit = 10;
const UserPost = () => {
  const UserInfo = useSelector(
    (state: RootState) => state.root?.authReducer?.userInfo
  ) as Users;
  const [refreshing, setRefreshing] = useState(false);
  const [Posts, setPosts] = useState<PostData[]>([]);

  useEffect(() => {
    getAllPost();
  }, []);

  const getAllPost = async () => {
    limit = limit + 10;
    const res = await fetchOnlyUserPost(limit, UserInfo?.id);
    if (res.success) {
      setPosts(res.data ?? []);
    }
  };

  const renderItem: ListRenderItem<PostData> = useCallback(
    ({ item }) => <MemoizedPostView item={item} />,
    []
  );

  return (
    <>
      {Posts?.length > 0 ? (
        <FlatList
          data={Posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => (
            <View
              style={{
                width: "100%",
                height: StyleSheet.hairlineWidth,
                backgroundColor: Colors.black,
              }}
            />
          )}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => getAllPost()}
            />
          }
        />
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <TitleText style={{ color: Colors.icon }}>No post yet...</TitleText>
        </View>
      )}
    </>
  );
};

export default UserPost;

const styles = StyleSheet.create({});
