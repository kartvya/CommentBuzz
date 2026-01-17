import { useMemo, useEffect, useState } from "react";
import Header from "@/src/shared/ui/Header";
import AnimatedLineChart from "@/src/shared/ui/lineChart/AnimatedLineChart";
import { chartHeight, chartWidth } from "@/src/shared/ui/lineChart/data";
import ScreenWrapper from "@/src/shared/ui/ScreenWrapper";
import { StyleSheet, View, Text } from "react-native";
import { useGetWeeklyAverageTime } from "@/src/modules/profile/hooks/useGetWeeklyAverageTime";
import Loading from "@/src/shared/ui/Loading";

interface WeeklyData {
  dailyBreakdown?: Record<string, number>;
  averageMinutes?: number;
}

const TimeManagement = () => {
  const { getWeeklyAverageTime, isLoading } = useGetWeeklyAverageTime();
  const [weeklyData, setWeeklyData] = useState<WeeklyData>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("[TimeManagement] Fetching weekly average time...");
        const result = await getWeeklyAverageTime();
        console.log(
          "[TimeManagement] API Response:",
          JSON.stringify(result, null, 2)
        );

        if (result.success && result.data) {
          const { dailyBreakdown, averageMinutes } = result.data;
          console.log("[TimeManagement] Setting data:", {
            averageMinutes,
            dailyBreakdownKeys: Object.keys(dailyBreakdown || {}),
            dailyBreakdownValues: Object.values(dailyBreakdown || {}),
          });

          setWeeklyData({
            dailyBreakdown: dailyBreakdown || {},
            averageMinutes: averageMinutes || 0,
          });
        } else {
          console.warn("[TimeManagement] No data in response:", result);
          setWeeklyData({
            dailyBreakdown: {},
            averageMinutes: 0,
          });
        }
      } catch (error) {
        console.error(
          "[TimeManagement] Error fetching weekly average time:",
          error
        );
        setWeeklyData({
          dailyBreakdown: {},
          averageMinutes: 0,
        });
      }
    };
    fetchData();
  }, [getWeeklyAverageTime]);

  // Calculate dynamic chart height based on data (supports more than 8 hours)
  const dynamicChartHeight = useMemo(() => {
    const dailyBreakdown = weeklyData?.dailyBreakdown || {};

    // Get all values from daily breakdown
    const values = Object.values(dailyBreakdown) as number[];
    const maxValue = values.length > 0 ? Math.max(...values) : 0;

    // Base height
    const baseHeight = chartHeight;

    // If there's no data or very little data, use minimum height
    if (maxValue === 0) {
      return Math.max(baseHeight * 0.5, 100); // At least 100px
    }

    // Scale height based on max value (in minutes)
    // Support up to 24 hours (1440 minutes) - can be extended further if needed
    // For 24 hours, use full height; scale proportionally for less
    const maxMinutesForFullHeight = 1440; // 24 hours
    const scaleFactor = Math.min(maxValue / maxMinutesForFullHeight, 1);
    // Scale between 50% and 150% of base height for very high usage
    const scaledHeight = baseHeight * (0.5 + scaleFactor * 1.0); // Between 50% and 150% of base height

    return Math.max(scaledHeight, 120); // Minimum 120px
  }, [weeklyData]);

  if (isLoading) {
    return (
      <ScreenWrapper>
        <Header title={"Time management"} showBackIcon={true} />
        <Loading />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Header title={"Time management"} showBackIcon={true} />
      <View style={styles.container}>
        <AnimatedLineChart
          width={chartWidth}
          height={dynamicChartHeight}
          data={weeklyData}
        />
      </View>
    </ScreenWrapper>
  );
};

export default TimeManagement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 120,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
});
