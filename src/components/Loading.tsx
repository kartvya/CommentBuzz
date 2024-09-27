import { ActivityIndicator, StyleSheet } from "react-native";
import { Colors, DarkColors } from "../constants/Colors";

interface Iprops {
  size?: number | "large" | "small" | undefined;
}

const Loading = (props: Iprops) => {
  return (
    <ActivityIndicator
      color={DarkColors.primaryColor}
      size={props?.size ? props?.size : "large"}
    />
  );
};

export default Loading;
