import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import MemoizedPostView from "../components/MemoizedPostView";
import { TitleText } from "../components/Text";
import { Colors, DarkColors } from "../constants/Colors";
import { RootState } from "../redux/Store";
import { Users } from "../redux/reducers/AuthReducer";
import { fetchOnlyUserPost } from "../services/postServices";
import { PostData } from "../utility/types";
import AntDesign from "@expo/vector-icons/AntDesign";
import { RFPercentage } from "react-native-responsive-fontsize";
import Spacer from "../components/Spacer";
import { useRouter } from "expo-router";
import { getUserData } from "../services/userService";
import { useIsFocused } from "@react-navigation/native";
import Loading from "../components/Loading";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {};

let limit = 10;

const UserPost = forwardRef<Props>((props, ref) => {
  const navigation = useRouter();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const paddingBottom = insets.bottom + 65;
  const UserInfo = useSelector(
    (state: RootState) => state.root?.authReducer?.userInfo
  ) as Users;
  const [refreshing, setRefreshing] = useState(false);
  const [Posts, setPosts] = useState<PostData[]>([]);
  const [visibleIndex, setVisibleIndex] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // const handlePost = async (payload: any) => {
  //   try {
  //     if (payload.eventType === "INSERT" && payload?.new?.id) {
  //       let newPost = { ...payload?.new };
  //       let res = await getUserData(newPost.userId);
  //       newPost.user = res.success ? res?.data : {};
  //       setPosts((prevPost) => {
  //         if (prevPost.some((post) => post.id === newPost.id)) {
  //           return prevPost;
  //         }
  //         return [newPost, ...prevPost];
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   let postChannel = supabase
  //     .channel("posts")
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "*",
  //         schema: "public",
  //         table: "posts",
  //       },
  //       handlePost
  //     )
  //     .subscribe();
  //   return () => {
  //     supabase.removeChannel(postChannel);
  //   };
  // }, [isFocused]);

  useEffect(() => {
    getAllPost();
  }, [isFocused]);

  const getAllPost = async () => {
    limit = limit + 10;
    const res = await fetchOnlyUserPost(limit, UserInfo?.id);

    if (res.success) {
      // Ensure res.data is defined before checking its length
      const postsData = res.data ?? [];

      if (postsData.length > 0 && postsData.length <= 10) {
        setHasMore(false);
        // Remove duplicates if needed
        setPosts((prevPosts) => {
          const uniquePosts = [
            ...new Map(
              [...prevPosts, ...postsData].map((post) => [post.id, post])
            ).values(),
          ];
          return uniquePosts;
        });
      } else {
        if (postsData.length === Posts.length) {
          setHasMore(false);
        }
        setPosts(postsData);
      }
    }
  };

  const refreshPulled = async () => {
    limit = 10;
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
      <MemoizedPostView
        item={item}
        isVisible={index === visibleIndex}
        fetchAllPost={() => refreshPulled()}
      />
    ),
    [visibleIndex, Posts, isFocused]
  );

  return (
    <>
      {Posts?.length > 0 ? (
        <FlatList
          data={Posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id?.toString()}
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
});

export default UserPost;
