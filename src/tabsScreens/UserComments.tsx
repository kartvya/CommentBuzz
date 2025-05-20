import { useIsFocused } from "@react-navigation/native";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { TitleText } from "../components/Text";
import { Colors, DarkColors } from "../constants/Colors";

import usePostServices from "../services/postServices";
import { CommentsData } from "../utility/types";
import MemoizedCommentView from "../components/MemoizedCommentView";
import { RefreshControl } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Loading from "../components/Loading";
import { RFPercentage } from "react-native-responsive-fontsize";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Spacer from "../components/Spacer";

let limit = 10;
const UserComments = () => {
  const { fetchOnlyUserComments } = usePostServices();

  const insets = useSafeAreaInsets();
  const paddingBottom = insets.bottom + 65;

  const navigation = useRouter();
  const isFocused = useIsFocused();
  const [comments, setAllComments] = useState<CommentsData[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getAllComments();
  }, [isFocused]);

  const getAllComments = async () => {
    try {
      limit = limit + 10;
      const res = await fetchOnlyUserComments(limit);
      if (res?.success) {
        // Ensure res.data is defined before checking its length
        const commentsData = res.data ?? [];

        if (commentsData.length > 0 && commentsData.length <= 10) {
          setHasMore(false);
          // Remove duplicates if needed
          setAllComments((prevPosts) => {
            const uniquePosts = [
              ...new Map(
                [...commentsData, ...prevPosts].map((comment) => [
                  comment._id,
                  comment,
                ])
              ).values(),
            ];
            return uniquePosts;
          });
        } else {
          if (commentsData.length === comments.length) {
            setHasMore(false);
          }
          setAllComments(commentsData);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const refreshPulled = async () => {
    limit = 10;
    const res = await fetchOnlyUserComments(limit);
    if (res?.success) {
      setAllComments(res.data ?? []);
    }
  };

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: Array<{ index: number | null }>;
  }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0]?.index ?? null;
    }
  };

  const viewabilityConfig = { itemVisiblePercentThreshold: 30 };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  const renderItem: ListRenderItem<CommentsData> = useCallback(
    ({ item, index }) => <MemoizedCommentView item={item} />,
    [comments, isFocused]
  );

  return (
    <>
      {comments?.length > 0 ? (
        <FlatList
          data={comments}
          renderItem={renderItem}
          keyExtractor={(item) => item._id?.toString()}
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
              onRefresh={() => refreshPulled()}
              tintColor={DarkColors.primaryColor}
            />
          }
          contentContainerStyle={{
            paddingBottom: paddingBottom,
          }}
          ListFooterComponent={() =>
            hasMore ? (
              <View style={{ marginVertical: RFPercentage(2) }}>
                <Loading />
              </View>
            ) : null
          }
        />
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Pressable onPress={() => navigation.navigate("/(main)/uploadPost")}>
            <AntDesign
              name="pluscircleo"
              size={RFPercentage(5)}
              color={Colors.icon}
            />
          </Pressable>
          <Spacer gap={RFPercentage(0.5)} />
          <TitleText style={{ color: Colors.icon, textAlign: "center" }}>
            No post yet,
          </TitleText>
          <TitleText style={{ color: Colors.icon, textAlign: "center" }}>
            share your best moments...
          </TitleText>
        </View>
      )}
    </>
  );
};

export default memo(UserComments);

const styles = StyleSheet.create({});
