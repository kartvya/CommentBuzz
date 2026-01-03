import { useThemeColors } from "@/src/shared/constants/colors";
import Feather from "@expo/vector-icons/Feather";
import { useEffect } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const icons = {
  feedScreen: (props) => <Feather name="home" size={24} {...props} />,
  Profile: (props) => <Feather name="user" size={24} {...props} />,
  createPost: (props) => <Feather name="plus" size={24} {...props} />,
};

const TabBarIcon = ({ onPress, isFocused, label }) => {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const themeColors = useThemeColors();

  useEffect(() => {
    opacity.value = withTiming(isFocused ? 0 : 1, { duration: 400 });
    translateY.value = withTiming(isFocused ? 0 : 0, { duration: 400 });
    scale.value = withTiming(isFocused ? 1.2 : 1, { duration: 400 });
  }, [isFocused]);

  const rText = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const rImage = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }, { scale: scale.value }],
    };
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
      }}
    >
      <Animated.View style={rImage}>
        {icons[label]({
          color: isFocused ? themeColors.primaryColor : themeColors.white,
        })}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default TabBarIcon;

const styles = StyleSheet.create({});
