import MyStatusBar from "@/src/components/CustomeStatusBar";
import FeedHeader from "@/src/components/FeedHeader";
import MemoizedPostView from "@/src/components/MemoizedPostView";
import { TitleText } from "@/src/components/Text";
import Wrapper from "@/src/components/Wrapper";
import { Colors } from "@/src/constants/Colors";
import { wp } from "@/src/helpers/comman";
import { fetchPost } from "@/src/services/postServices";
import { PostData } from "@/src/utility/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { RootState } from "@/src/redux/Store";
import { User } from "@supabase/supabase-js";
import LottieView from "lottie-react-native";
import {
  Animated,
  FlatListProps,
  ListRenderItem,
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
  const paddingTop = insets.top > 30 ? insets.top + 5 : 30;

  const flatlistRef = useRef<RNFlatList>(null);
  const [scrollY] = useState(new Animated.Value(0));
  const [refreshing, setRefreshing] = useState(false);
  const [Posts, setPosts] = useState<PostData[]>([]);

  useEffect(() => {
    getAllPost();
  }, []);

  const getAllPost = async () => {
    limit = limit + 10;
    console.log("Updated limit", limit);
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
    }
  };

  const viewabilityConfig = { itemVisiblePercentThreshold: 30 };

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
    ({ item }) => <MemoizedPostView item={item} />,
    []
  );

  return (
    <>
      <MyStatusBar backgroundColor={Colors.white} barStyle="dark-content" />
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
          viewabilityConfigCallbackPairs={
            viewabilityConfigCallbackPairs.current
          }
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingTop: paddingTop,
            paddingVertical: RFPercentage(1),
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => getAllPost()}
              progressViewOffset={paddingTop}
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

export default FeedScreen;

const styles = StyleSheet.create({
  headerContainer: {
    zIndex: 1000,
    backgroundColor: Colors.white,
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
