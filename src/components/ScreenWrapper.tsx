import { StatusBar } from "expo-status-bar";
import { ReactNode } from "react";
import { View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MyStatusBar from "./CustomeStatusBar";
import { Colors } from "react-native/Libraries/NewAppScreen";

interface ScreenWrapperProps {
  children: ReactNode;
  bg?: string;
  conatinerStyle?: ViewStyle;
}

const ScreenWrapper = ({
  children,
  bg,
  conatinerStyle,
}: ScreenWrapperProps) => {
  const insets = useSafeAreaInsets();
  const paddingTop = insets.top > 30 ? insets.top + 5 : 30;

  return (
    <>
      <MyStatusBar backgroundColor={Colors.white} barStyle="dark-content" />
      <View style={[{ flex: 1, backgroundColor: bg }, conatinerStyle]}>
        {children}
      </View>
    </>
  );
};

export default ScreenWrapper;
