import { StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ReactNode } from "react";
import { StatusBar } from "expo-status-bar";

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
    <View
      style={[{ flex: 1, backgroundColor: bg, paddingTop }, conatinerStyle]}
    >
      <StatusBar backgroundColor="white" style="dark" />
      {children}
    </View>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({});
