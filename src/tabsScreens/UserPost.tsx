import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import MemoizedPostView from "../components/MemoizedPostView";
import { TitleText } from "../components/Text";
import { Colors, DarkColors } from "../constants/Colors";
import { RootState } from "../redux/Store";
import { Users } from "../redux/reducers/AuthReducer";
import { fetchOnlyUserPost } from "../services/postServices";
import { PostData } from "../utility/types";

type Props = {};

let limit = 10;

const UserPost = forwardRef<Props>((props, ref) => {
  const UserInfo = useSelector(
    (state: RootState) => state.root?.authReducer?.userInfo
  ) as Users;
  const [refreshing, setRefreshing] = useState(false);
  const [Posts, setPosts] = useState<PostData[]>([]);
  const [visibleIndex, setVisibleIndex] = useState<number | null>(null);

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

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: Array<{ index: number | null }>;
  }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0]?.index ?? null;
      setVisibleIndex(index);
    }
  };

  const viewabilityConfig = { itemVisiblePercentThreshold: 30 };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  const renderItem: ListRenderItem<PostData> = useCallback(
    ({ item, index }) => (
      <MemoizedPostView item={item} isVisible={index === visibleIndex} />
    ),
    [visibleIndex, Posts]
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
          viewabilityConfigCallbackPairs={
            viewabilityConfigCallbackPairs.current
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => getAllPost()}
              tintColor={DarkColors.primaryColor}
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
});

export default UserPost;
