import { useCallback, useRef } from "react";
import { FlatList, ListRenderItemInfo, StyleSheet, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import Wrapper from "../components/Wrapper";
//@ts-ignore
// import Video from "react-native-video";
import MemoizedPostView from "../components/MemoizedPostView";
import ScreenWrapper from "../components/ScreenWrapper";

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
    <ScreenWrapper>
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
          contentContainerStyle={{ paddingVertical: RFPercentage(2) }}
        />
      </Wrapper>
    </ScreenWrapper>
  );
};

export default Feed;

const styles = StyleSheet.create({
  paginationDotStyle: {
    width: 9,
    height: 9,
    borderRadius: 30,
  },
});
