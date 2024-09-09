import MyStatusBar from "@/src/components/CustomeStatusBar";
import FeedHeader from "@/src/components/FeedHeader";
import MemoizedPostView from "@/src/components/MemoizedPostView";
import Wrapper from "@/src/components/Wrapper";
import { Colors } from "@/src/constants/Colors";
import { wp } from "@/src/helpers/comman";
import { RootState } from "@/src/redux/Store";
import { User } from "@supabase/supabase-js";
import { useCallback, useRef, useState } from "react";
import {
  Animated,
  ListRenderItemInfo,
  FlatList as RNFlatList,
  StyleSheet,
  View,
} from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const AnimatedFlatList = Animated.createAnimatedComponent(RNFlatList);

const FeedScreen = () => {
  const UserInfo = useSelector(
    (state: RootState) => state.root?.authReducer?.userInfo
  ) as User;
  const insets = useSafeAreaInsets();
  const paddingTop = insets.top > 30 ? insets.top + 5 : 30;

  const flatlistRef = useRef<RNFlatList>(null);
  const [scrollY] = useState(new Animated.Value(0));
  const [refreshing, setRefreshing] = useState(false);

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
    ({ item }: ListRenderItemInfo<any>) => <MemoizedPostView item={item} />,
    []
  );

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
      <Wrapper>
        <AnimatedFlatList
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
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingTop: paddingTop + 5,
            paddingVertical: RFPercentage(1),
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => console.log("On Refresh")}
              progressViewOffset={paddingTop}
            />
          }
        />
      </Wrapper>
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
