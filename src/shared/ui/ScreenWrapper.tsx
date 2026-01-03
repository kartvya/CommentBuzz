import { ReactNode } from "react";
import { View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "@/src/shared/constants/colors";
import MyStatusBar from "./CustomeStatusBar";

interface ScreenWrapperProps {
  children: ReactNode;
  bg?: string;
  conatinerStyle?: ViewStyle;
  statusBarColor?: string;
}

const ScreenWrapper = ({
  children,
  bg,
  conatinerStyle,
  statusBarColor,
}: ScreenWrapperProps) => {
  const insets = useSafeAreaInsets();
  const themeColors = useThemeColors();

  return (
    <>
      <MyStatusBar
        backgroundColor={statusBarColor ? statusBarColor : themeColors.lightBg}
        barStyle="light-content"
      />
      <View
        style={[
          { flex: 1, backgroundColor: themeColors.backGround },
          conatinerStyle,
        ]}
      >
        {children}
      </View>
    </>
  );
};

export default ScreenWrapper;
