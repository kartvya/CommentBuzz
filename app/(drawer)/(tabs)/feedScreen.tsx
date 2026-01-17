import MyStatusBar from "@/src/shared/ui/CustomeStatusBar";
import FeedHeader from "@/src/shared/ui/FeedHeader";
import Loading from "@/src/shared/ui/Loading";
import MemoizedPostView from "@/src/shared/ui/MemoizedPostView";
import { TitleText } from "@/src/shared/ui/Text";
import { useThemeColors } from "@/src/shared/constants/colors";
import { wp } from "@/src/shared/utils/comman";
import { useGetPosts } from "@/src/modules/post/hooks/useGetPosts";
import { PostData } from "@/src/modules/post";
import { useIsFocused } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { RootState } from "@/src/redux/Store";
import { UserInfo } from "@/src/modules/auth";
import {
  AuthenticationError,
  LogoutRequiredError,
} from "@/src/shared/errors/domain.errors";
import {
  Animated,
  FlatListProps,
  ListRenderItem,
  Platform,
  FlatList as RNFlatList,
  StyleSheet,
  View,
} from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppSessionTracker } from "@/src/shared/hooks/useAppSessionTracker";

const AnimatedFlatList =
  Animated.createAnimatedComponent<
    React.ComponentType<FlatListProps<PostData>>
  >(RNFlatList);

const POSTS_PER_PAGE = 10;

const FeedScreen = () => {
  const { getPosts, isLoading } = useGetPosts();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const themeColors = useThemeColors();
  const paddingTop = insets.top > 30 ? insets.top + 5 : 30;
  const paddingBottom = insets.bottom + 65;
  const flatlistRef = useRef<RNFlatList>(null);
  const [scrollY] = useState(new Animated.Value(0));
  const [visibleIndex, setVisibleIndex] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentLimit, setCurrentLimit] = useState(POSTS_PER_PAGE);
  const [hasMore, setHasMore] = useState(true);
  const [Posts, setPosts] = useState<PostData[]>([]);

  // Check if user is authenticated
  const userInfo = useSelector(
    (state: RootState) => state.auth?.userInfo,
    shallowEqual
  ) as UserInfo | null;

  useAppSessionTracker();

  interface PostPayload {
    eventType: "INSERT" | "UPDATE" | "DELETE";
    new?: PostData & { id?: string };
    old?: PostData & { id?: string };
  }

  const handlePost = useCallback(async (payload: PostPayload) => {
    try {
      console.log("Payload received:", payload);

      if (payload.eventType === "INSERT" && payload?.new?.id) {
        let newPost = { ...payload.new };

        // Check and update state
        setPosts((prevPosts) => {
          const postExists = prevPosts.some((post) => post._id === newPost.id);

          if (postExists) {
            // Post already exists, update it
            return prevPosts.map((post) =>
              post._id === newPost.id ? newPost : post
            );
          }

          // Add new post to state
          return [newPost, ...prevPosts];
        });
      }
    } catch (error) {
      console.error("Error in handlePost:", error);
    }
  }, []);

  const loadPosts = useCallback(
    async (limit: number, append: boolean = false) => {
      // Don't make API call if user is not authenticated
      if (!userInfo) {
        console.log("[FeedScreen] User not authenticated, skipping post fetch");
        return;
      }

      try {
        console.log(
          "[FeedScreen] Loading posts, limit:",
          limit,
          "append:",
          append
        );
        const res = await getPosts(limit);
        console.log("[FeedScreen] getPosts response:", {
          success: res.success,
          dataLength: res.data?.length ?? 0,
          message: res.message,
        });

        if (res.success) {
          const postsData = res.data ?? [];
          console.log("[FeedScreen] Posts data:", {
            count: postsData.length,
            firstPostId: postsData[0]?._id,
          });

          if (append) {
            // Append new posts, avoiding duplicates
            setPosts((prevPosts) => {
              const existingIds = new Set(prevPosts.map((p) => p._id));
              const newPosts = postsData.filter((p) => !existingIds.has(p._id));
              console.log("[FeedScreen] Appending posts:", {
                prevCount: prevPosts.length,
                newCount: newPosts.length,
                totalAfter: prevPosts.length + newPosts.length,
              });
              return [...prevPosts, ...newPosts];
            });
          } else {
            // Replace posts (for refresh)
            console.log(
              "[FeedScreen] Replacing posts with",
              postsData.length,
              "posts"
            );
            setPosts(postsData);
          }

          // Determine if there are more posts to load
          setHasMore(postsData.length === limit);
          console.log(
            "[FeedScreen] Has more posts:",
            postsData.length === limit
          );
        } else {
          console.warn(
            "[FeedScreen] getPosts returned success: false",
            res.message
          );
        }
      } catch (error) {
        // Silently handle authentication errors (user might be logging out or not authenticated)
        if (
          error instanceof AuthenticationError ||
          error instanceof LogoutRequiredError
        ) {
          console.log(
            "[FeedScreen] User not authenticated, skipping post fetch"
          );
          return;
        }

        console.error("[FeedScreen] Error loading posts:", error);
        if (error instanceof Error) {
          console.error("[FeedScreen] Error details:", {
            message: error.message,
            name: error.name,
            stack: error.stack,
          });
        }
      }
    },
    [getPosts, userInfo]
  );

  const getAllPost = useCallback(async () => {
    const newLimit = currentLimit + POSTS_PER_PAGE;
    setCurrentLimit(newLimit);
    await loadPosts(newLimit, true);
  }, [currentLimit, loadPosts]);

  useEffect(() => {
    // Only fetch posts if user is authenticated and screen is focused
    if (userInfo && isFocused) {
      setCurrentLimit(POSTS_PER_PAGE);
      loadPosts(POSTS_PER_PAGE, false);
    }
  }, [isFocused, loadPosts, userInfo]);

  const refreshPulled = useCallback(async () => {
    setRefreshing(true);
    setCurrentLimit(POSTS_PER_PAGE);
    await loadPosts(POSTS_PER_PAGE, false);
    setRefreshing(false);
  }, [loadPosts]);

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

  const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, -100],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const renderItem: ListRenderItem<PostData> = useCallback(
    ({ item, index }) => (
      <>
        <MemoizedPostView
          item={item}
          isVisible={index === visibleIndex}
          fetchAllPost={refreshPulled}
        />
      </>
    ),
    [visibleIndex, refreshPulled]
  );

  return (
    <>
      <MyStatusBar
        backgroundColor={themeColors.lightBg}
        barStyle="light-content"
      />
      <Animated.View
        style={[
          styles.headerContainer,
          {
            transform: [{ translateY: headerTranslateY }],
            opacity: headerOpacity,
            paddingTop: paddingTop,
            paddingBottom: wp(3),
            backgroundColor: themeColors?.lightBg,
          },
        ]}
      >
        <FeedHeader />
      </Animated.View>
      {Posts?.length > 0 ? (
        <AnimatedFlatList
          data={Posts}
          ref={flatlistRef}
          renderItem={renderItem}
          keyExtractor={(item) => item._id.toString()}
          style={{ backgroundColor: themeColors?.backGround }}
          ItemSeparatorComponent={() => (
            <View
              style={{
                width: "100%",
                height: StyleSheet.hairlineWidth,
                backgroundColor: themeColors?.borderColor,
              }}
            />
          )}
          showsVerticalScrollIndicator={false}
          viewabilityConfigCallbackPairs={
            viewabilityConfigCallbackPairs.current
          }
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingTop:
              Platform.OS === "android" ? paddingTop + 30 : paddingTop,
            paddingBottom: paddingBottom,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => refreshPulled()}
              progressViewOffset={paddingTop}
              tintColor={themeColors.primaryColor}
            />
          }
          onEndReachedThreshold={0}
          onEndReached={() => getAllPost()}
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
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: themeColors?.backGround,
          }}
        >
          <TitleText>No post yet...</TitleText>
        </View>
      )}
    </>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({
  headerContainer: {
    zIndex: 1000,
    position: "absolute",
    left: 0,
    right: 0,
  },
  headerSubContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: wp(3),
    justifyContent: "space-between",
  },
  headerTitleText: {
    fontSize: RFValue(20),
  },
});
