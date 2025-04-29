import React, { useImperativeHandle } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { NormalText, TitleText } from "../Text";
import { days, timeSpentData } from "./data";
import { ChartRef, TProps } from "./types";
import { useThemeColors } from "@/src/constants/Colors";

const AnimatedLineChart = React.forwardRef<ChartRef, TProps>((props, ref) => {
  const { width, height } = props;
  const themeColors = useThemeColors();
  const progress = useSharedValue(0);

  const animate = (forward = true) => {
    progress.value = withTiming(forward ? 1 : 0, {
      duration: 2000,
      easing: Easing.out(Easing.exp),
    });
  };

  useImperativeHandle(ref, () => ({
    animate,
  }));

  return (
    <View style={styles.mainConatiner}>
      <View style={{ marginVertical: RFPercentage(1), alignItems: "center" }}>
        <TitleText style={styles.avrageTimeText}>1h20m</TitleText>
        <NormalText
          style={{ lineHeight: 23, fontSize: RFValue(14), marginBottom: 5 }}
        >
          Daily average
        </NormalText>
        <NormalText
          style={{ textAlign: "center", marginHorizontal: RFPercentage(2) }}
        >
          Spend 8+ hours in the app today and earn 10 Buzzcoins! ⏳ Keep
          engaging to unlock rewards!
        </NormalText>
      </View>
      <View style={[styles.yAxisContainer]}>
        {timeSpentData.map((timeSpent, index) => {
          const normalizedHeight = (timeSpent / 24) * height;
          return (
            <Animated.View
              key={`horizontal-${index}`}
              style={[
                styles.horizontalL,
                {
                  height: normalizedHeight,
                  width: width / 8,
                  marginHorizontal: RFPercentage(0.2),
                  backgroundColor: themeColors.chartColor,
                },
              ]}
            />
          );
        })}
      </View>
      <View style={styles.yAxisContainer}>
        {days.map((day, index) => (
          <View key={`x-axis-${index}`}>
            <NormalText
              style={[
                styles.day,
                {
                  width: width / 8,
                  marginHorizontal: RFPercentage(0.2),
                },
              ]}
            >
              {day}
            </NormalText>
          </View>
        ))}
      </View>
    </View>
  );
});

export default AnimatedLineChart;

const styles = StyleSheet.create({
  yAxisContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: RFPercentage(1),
  },
  day: {
    textAlign: "center",
    fontSize: 12,
  },
  horizontalL: {
    borderRadius: 10,
    // position: "absolute",
    // bottom: 0,
  },
  chartBaseContainer: {
    // position: "absolute",
  },
  mainConatiner: {
    flex: 1,
    alignItems: "center",
  },
  avrageTimeText: {
    textAlign: "center",
    fontSize: RFValue(30),
  },
});
