import { ActivityIndicator } from "react-native";
import { DarkColors } from "@/src/shared/constants/colors";

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
