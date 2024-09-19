import { ActivityIndicator, StyleSheet } from "react-native";
import { Colors, DarkColors } from "../constants/Colors";

const Loading = () => {
  return <ActivityIndicator color={DarkColors.primaryColor} size={"large"} />;
};

export default Loading;
