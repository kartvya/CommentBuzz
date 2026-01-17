import React, {
  forwardRef,
  memo,
  useCallback,
  ComponentPropsWithoutRef,
} from "react";
import {
  FlatList,
  FlatListProps,
  ListRenderItem,
  StyleSheet,
} from "react-native";
import Animated from "react-native-reanimated";
import ConnectionItem from "./ConnectionItem";
import { Connection } from "../types";

export const AnimatedFlatList = forwardRef<
  FlatList<Connection>,
  ComponentPropsWithoutRef<typeof Animated.FlatList<Connection>>
>((props, ref) => <Animated.FlatList {...props} ref={ref as React.RefObject<FlatList<Connection>>} />);

type Props = Omit<
  ComponentPropsWithoutRef<typeof Animated.FlatList<Connection>>,
  "renderItem"
>;

const ConnectionList = forwardRef<FlatList, Props>((props, ref) => {
  const keyExtractor = useCallback(
    (_item: Connection, index: number) => index.toString(),
    []
  );

  const renderItem = useCallback<ListRenderItem<Connection>>(
    ({ item }) => <ConnectionItem connection={item} />,
    []
  );

  return (
    <AnimatedFlatList
      ref={ref}
      style={styles.container}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      {...props}
    />
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
});

export default memo(ConnectionList);
