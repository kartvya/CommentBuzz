import React, { useCallback, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { replaceMentionValues } from "react-native-controlled-mentions";
import ParsedText from "react-native-parsed-text";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useDispatch } from "react-redux";
import DoubleTouchableOpacity from "../components/DoubleTouchableOpacity";
import { MXicon } from "../components/Icons";
import Paginator from "../components/Paginator";
import Wrapper from "../components/Wrapper";
//@ts-ignore
// import Video from "react-native-video";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import MemoizedPostView from "../components/MemoizedPostView";

const Feed = () => {
  // const userPost = useAppSelector(
  //   (state: { home: { posts: any } }) => state.home.posts
  // ) as Post[];
  // const dispatch = useDispatch<AppDispatch>();
  const flatlistRef = useRef<FlatList>(null);
  // const [visibleIndex, setVisibleIndex] = useState<number | null>(null);

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: Array<{ index: number | null }>;
  }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0]?.index ?? null;
    }
  };

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<any>) => (
      <MemoizedPostView item={item} />
    ),
    []
  );

  const viewabilityConfig = { itemVisiblePercentThreshold: 30 };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  return (
    <View style={styles.container}>
      <Wrapper>
        <FlatList
          ref={flatlistRef}
          renderItem={renderItem}
          data={[...new Array(6).keys()]}
          keyExtractor={() => Math.random().toString()}
          ItemSeparatorComponent={() => (
            <View style={{ marginVertical: RFPercentage(1) }} />
          )}
          showsVerticalScrollIndicator={false}
          viewabilityConfigCallbackPairs={
            viewabilityConfigCallbackPairs.current
          }
        />
      </Wrapper>
    </View>
  );
};

export default Feed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  paginationDotStyle: {
    width: 9,
    height: 9,
    borderRadius: 30,
  },
});
