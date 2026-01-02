import React, { useImperativeHandle, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useThemeColors } from "@/src/constants/Colors";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { NormalText, TitleText } from "../Text";
import { ChartRef, TProps } from "./types";

// Helper function to get last 7 days dates
const getLast7Days = () => {
  const dates = [];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
    const dayName = dayNames[date.getDay()];
    dates.push({ date: dateStr, dayName });
  }
  return dates;
};

// Helper function to transform dailyBreakdown to array format
const transformDailyData = (dailyBreakdown: Record<string, number> = {}) => {
  const last7Days = getLast7Days();
  return last7Days.map(({ date }) => {
    return dailyBreakdown[date] || 0; // Return minutes for each day, 0 if no data
  });
};

// Helper function to format minutes as "Xh Ym" or "Ym" format
const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${Math.round(minutes)}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  return `${hours}h ${remainingMinutes.toString().padStart(2, "0")}m`;
};

const AnimatedLineChart = React.forwardRef<ChartRef, TProps>((props, ref) => {
  const { width, height, data } = props;
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

  // Transform the daily breakdown data into an array
  const timeSpentData = useMemo(() => {
    if (data?.dailyBreakdown) {
      return transformDailyData(data.dailyBreakdown);
    }
    return [0, 0, 0, 0, 0, 0, 0]; // Default empty data
  }, [data?.dailyBreakdown]);

  // Calculate max value for scaling (add 20% padding for better visualization)
  const maxValue = useMemo(() => {
    const max = Math.max(...timeSpentData, 1); // At least 1 to avoid division by zero
    return max * 1.2; // Add 20% padding
  }, [timeSpentData]);

  // Get day names for the last 7 days
  const dayLabels = useMemo(() => {
    return getLast7Days().map(({ dayName }) => dayName);
  }, []);

  return (
    <View style={styles.mainConatiner}>
      <View style={{ marginVertical: RFPercentage(1), alignItems: "center" }}>
        <TitleText style={styles.avrageTimeText}>
          {formatTime(data?.averageMinutes || 0)}
        </TitleText>
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
      <View style={[styles.yAxisContainer, { height: "30%" }]}>
        {timeSpentData.map((timeSpent, index) => {
          const normalizedHeight =
            maxValue > 0 ? (timeSpent / maxValue) * height : 0;

          return (
            <Animated.View
              key={`horizontal-${index}`}
              style={[
                styles.horizontalL,
                {
                  height: Math.max(normalizedHeight, 2), // Minimum 2px height for visibility
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
        {dayLabels.map((day, index) => (
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
