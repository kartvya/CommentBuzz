import { ActivityIndicator, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

const Loading = () => {
  return <ActivityIndicator color={Colors.primeColor} size={"large"} />;
};

export default Loading;
