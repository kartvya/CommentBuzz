import { Colors, DarkColors } from "@/src/shared/constants/colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Loading from "../shared/ui/Loading";
import MemoizedPostView from "../shared/ui/MemoizedPostView";
import Spacer from "../shared/ui/Spacer";
import { TitleText } from "../shared/ui/Text";
import { useGetOnlyUserPost } from "../modules/post/hooks/useGetOnlyUserPost";
import { PostData } from "../modules/post";
import { useSelector } from "react-redux";
import { RootState } from "../redux/Store";
import { AuthenticationError } from "../shared/errors/domain.errors";

type Props = {};

let limit = 10;

const UserPost = forwardRef<Props>((props, ref) => {
  const { getOnlyUserPost } = useGetOnlyUserPost();
  const userInfo = useSelector((state: RootState) => state.auth?.userInfo);

  const navigation = useRouter();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const paddingBottom = insets.bottom + 65;
  const [refreshing, setRefreshing] = useState(false);
  const [Posts, setPosts] = useState<PostData[]>([]);
  const [visibleIndex, setVisibleIndex] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Only fetch posts if user is authenticated
    if (userInfo && isFocused) {
      getAllPost();
    }
  }, [isFocused, userInfo]);

  const getAllPost = async () => {
    // Don't make API call if user is not authenticated
    if (!userInfo) {
      return;
    }

    try {
      limit = limit + 10;
      const res = await getOnlyUserPost(limit);
      if (res.success) {
        const postsData = res.posts ?? [];

        if (postsData.length > 0 && postsData.length <= 10) {
          setHasMore(false);
          setPosts((prevPosts) => {
            const uniquePosts = [
              ...new Map(
                [...postsData, ...prevPosts].map((post) => [post._id, post])
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
    } catch (error) {
      // Silently handle authentication errors (user might be logging out)
      if (error instanceof AuthenticationError) {
        console.log("User not authenticated, skipping post fetch");
        return;
      }
      console.error("Error fetching user posts:", error);
    }
  };

  const refreshPulled = async () => {
    // Don't make API call if user is not authenticated
    if (!userInfo) {
      return;
    }

    try {
      limit = 10;
      const res = await getOnlyUserPost(limit);
      if (res.success) {
        setPosts(res.posts ?? []);
      }
    } catch (error) {
      // Silently handle authentication errors (user might be logging out)
      if (error instanceof AuthenticationError) {
        console.log("User not authenticated, skipping post refresh");
        return;
      }
      console.error("Error refreshing user posts:", error);
    } finally {
      setRefreshing(false);
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
              name="plus-circle"
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
