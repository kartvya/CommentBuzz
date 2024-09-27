import { Colors } from "@/src/constants/Colors";
import React, { FunctionComponent } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  interpolateColor,
} from "react-native-reanimated";
import { RFPercentage } from "react-native-responsive-fontsize";

interface PaginatorProps {
  data: any[];
  scrollX: Animated.SharedValue<number>;
}

const Paginator: FunctionComponent<PaginatorProps> = ({ data, scrollX }) => {
  const { width } = useWindowDimensions();
  const smallDotSize = RFPercentage(1);
  const dotSpacing = RFPercentage(1);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        {data.map((_, i) => {
          const animatedDotStyle = useAnimatedStyle(() => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = interpolate(scrollX.value, inputRange, [
              smallDotSize,
              smallDotSize,
              smallDotSize,
            ]);
            const opacity = interpolate(scrollX.value, inputRange, [1, 1, 1]);
            const backgroundColor = interpolateColor(
              scrollX.value,
              inputRange,
              ["#DDDDDD", Colors.primeColor, "#DDDDDD"]
            );

            return {
              width: dotWidth,
              height: dotWidth,
              opacity,
              backgroundColor,
              marginHorizontal: dotSpacing / 2, // To apply margin without recalculating inside animation
            };
          });

          return (
            <Animated.View
              key={i.toString()}
              style={[styles.dot, animatedDotStyle]}
            />
          );
        })}
      </View>
    </View>
  );
};

export default Paginator;

const styles = StyleSheet.create({
  dot: {
    borderRadius: 50,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
