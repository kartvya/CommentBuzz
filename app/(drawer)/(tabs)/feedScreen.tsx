import { supabase } from "@/lib/supabase";
import MyStatusBar from "@/src/components/CustomeStatusBar";
import FeedHeader from "@/src/components/FeedHeader";
import Loading from "@/src/components/Loading";
import MemoizedPostView from "@/src/components/MemoizedPostView";
import { TitleText } from "@/src/components/Text";
import { DarkColors } from "@/src/constants/Colors";
import { wp } from "@/src/helpers/comman";
import { fetchPost } from "@/src/services/postServices";
import { getUserData } from "@/src/services/userService";
import { PostData } from "@/src/utility/types";
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

const AnimatedFlatList =
  Animated.createAnimatedComponent<
    React.ComponentType<FlatListProps<PostData>>
  >(RNFlatList);

let limit = 0;
const FeedScreen = () => {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const paddingTop = insets.top > 30 ? insets.top + 5 : 30;
  const paddingBottom = insets.bottom + 65;
  const flatlistRef = useRef<RNFlatList>(null);
  const [scrollY] = useState(new Animated.Value(0));
  const [visibleIndex, setVisibleIndex] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [Posts, setPosts] = useState<PostData[]>([]);

  const handlePost = async (payload: any) => {
    try {
      console.log("Payload received:", payload);

      if (payload.eventType === "INSERT" && payload?.new?.id) {
        let newPost = { ...payload?.new };

        // Fetch user data
        let res = await getUserData(newPost.userId);
        newPost.user = res.success ? res?.data : {};

        // Check and update state
        setPosts((prevPosts) => {
          const postExists = prevPosts.some((post) => post.id === newPost.id);
          console.log(postExists, "postExists");

          if (postExists) {
            // Post already exists, check if update is required
            const updatedPosts = prevPosts.map((post) =>
              post.id === newPost.id ? newPost : post
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
      const postsData = res.data ?? [];

      if (postsData.length > 0 && postsData.length <= 10) {
        setHasMore(false);
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

  useEffect(() => {
    let postChannel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "posts",
        },
        handlePost
      )
      .subscribe();
    return () => {
      supabase.removeChannel(postChannel);
    };
  }, [isFocused]);

  useEffect(() => {
    getAllPost();
  }, [isFocused]);

  const refreshPulled = async () => {
    limit = 10;
    const res = await fetchPost(limit);
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
        backgroundColor={DarkColors.lightBg}
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
          keyExtractor={(item) => item.id.toString()}
          style={{ backgroundColor: DarkColors?.backGround }}
          ItemSeparatorComponent={() => (
            <View
              style={{
                width: "100%",
                height: StyleSheet.hairlineWidth,
                backgroundColor: DarkColors?.borderColor,
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
              tintColor={DarkColors.primaryColor}
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
            backgroundColor: DarkColors?.backGround,
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
    backgroundColor: DarkColors?.lightBg,
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
