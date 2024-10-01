import Header from "@/src/components/Header";
import AnimatedLineChart from "@/src/components/lineChart/AnimatedLineChart";
import { chartHeight, chartWidth, data } from "@/src/components/lineChart/data";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { StyleSheet } from "react-native";

const TimeManagement = () => {
  return (
    <ScreenWrapper>
      <Header title={"Time management"} showBackIcon={true} />
      <AnimatedLineChart width={chartWidth} height={chartHeight} />
    </ScreenWrapper>
  );
};

export default TimeManagement;

const styles = StyleSheet.create({});
