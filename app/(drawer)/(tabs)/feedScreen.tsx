import MyStatusBar from "@/src/shared/ui/CustomeStatusBar";
import FeedHeader from "@/src/shared/ui/FeedHeader";
import Loading from "@/src/shared/ui/Loading";
import MemoizedPostView from "@/src/shared/ui/MemoizedPostView";
import { TitleText } from "@/src/shared/ui/Text";
import { useThemeColors } from "@/src/shared/constants/colors";
import { wp } from "@/src/shared/utils/comman";
import usePostServices from "@/src/services/postServices";
import { PostData } from "@/src/shared/types";
import { useIsFocused } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
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

let limit = 0;
const FeedScreen = () => {
  const { fetchPost } = usePostServices();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const themeColors = useThemeColors();
  const paddingTop = insets.top > 30 ? insets.top + 5 : 30;
  const paddingBottom = insets.bottom + 65;
  const flatlistRef = useRef<RNFlatList>(null);
  const [scrollY] = useState(new Animated.Value(0));
  const [visibleIndex, setVisibleIndex] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [Posts, setPosts] = useState<PostData[]>([]);

  // Track app session time
  useAppSessionTracker();

  // const appState = useRef(AppState.currentState);
  // const [startTime, setStartTime] = useState<Date | null>(null);

  // const UserInfo = useSelector(
  //   (state: RootState) => state.auth?.userInfo
  // ) as Users;

  // useEffect(() => {
  //   const subscription = AppState.addEventListener("change", (nextAppState) => {
  //     if (
  //       appState.current.match(/inactive|background/) &&
  //       nextAppState === "active"
  //     ) {
  //       setStartTime(new Date());
  //     } else if (appState.current.match(/inactive|background/)) {
  //       if (startTime) {
  //         const endTime = new Date();
  //         const timeSpent =
  //           (endTime.getTime() - startTime.getTime()) / 1000 / 60;
  //         saveTimeSpentToSupabase(timeSpent);
  //         setStartTime(null);
  //       }
  //     }
  //     console.log(appState.current);
  //     appState.current = nextAppState;
  //   });

  //   return () => {
  //     subscription.remove();
  //   };
  // }, [startTime]);

  const handlePost = async (payload: any) => {
    try {
      console.log("Payload received:", payload);

      if (payload.eventType === "INSERT" && payload?.new?.id) {
        let newPost = { ...payload?.new };

        // Fetch user data
        // let res = await getUserData(newPost.userId);
        // newPost.user = res.success ? res?.data : {};

        // Check and update state
        setPosts((prevPosts) => {
          const postExists = prevPosts.some((post) => post._id === newPost.id);

          if (postExists) {
            // Post already exists, check if update is required
            const updatedPosts = prevPosts.map((post) =>
              post._id === newPost.id ? newPost : post
            );
            return updatedPosts;
          }

          // Add new post to state
          return [newPost, ...prevPosts];
        });
      }
    } catch (error) {
      console.error("Error in handlePost:", error);
    }
  };

  const getAllPost = async () => {
    limit = limit + 10;
    const res = await fetchPost(limit);
    if (res.success) {
      const postsData = res.data.posts ?? [];

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
  };

  useEffect(() => {
    getAllPost();
  }, [isFocused]);

  const refreshPulled = async () => {
    limit = 10;
    const res = await fetchPost(limit);
    if (res.success) {
      setPosts(res.data?.posts ?? []);
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
          fetchAllPost={() => refreshPulled()}
        />
      </>
    ),
    [visibleIndex, Posts, isFocused]
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
