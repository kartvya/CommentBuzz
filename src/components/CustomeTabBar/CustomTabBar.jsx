import { useThemeColors } from "@/src/constants/Colors";
import { useEffect, useState } from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TabBarIcon from "./TabBarIcon";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function CustomTabBar({ state, descriptors, navigation }) {
  const translateX = useSharedValue(0);
  const uploadNavigation = useRouter();
  const themeColors = useThemeColors();
  const [dimentions, setDimentions] = useState({ width: 200, height: 100 });

  const buttonWidth = dimentions.width / state.routes.length;

  const onTabBarLayout = (e) => {
    console.log(e.nativeEvent);
    setDimentions({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  };

  useEffect(() => {
    translateX.value = withSpring(buttonWidth * state.index, {
      duration: 1300,
    });
  }, [state.index]);

  const rCircle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          bottom: Platform.OS === "ios" ? insets.bottom - 10 : insets.bottom + 5,
          backgroundColor: themeColors.votesBg,
        },
      ]}
      onLayout={onTabBarLayout}
    >
      <Animated.View
        style={[
          rCircle,
          {
            width: buttonWidth - 12,
            height: dimentions.height - 15,
            position: "absolute",
            backgroundColor: themeColors.white,
            borderRadius: 40,
            zIndex: -1,
            marginHorizontal: 6,
          },
        ]}
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          if (route.name === "createPost") {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              uploadNavigation.navigate("/(main)/uploadPost", route.params);
            }
          } else {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarIcon
            key={label}
            onPress={onPress}
            isFocused={isFocused}
            label={label}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    height: 60,
    position: "absolute",
    alignSelf: "center",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "space-evenly",
    width: width * 0.95,
    shadowColor: "black",
    shadowOffset: { height: 10, width: 0 },
    shadowRadius: 15,
    shadowOpacity: 0.5,
    elevation: 15,
  },
});
