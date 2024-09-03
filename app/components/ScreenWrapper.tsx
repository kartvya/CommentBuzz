import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ReactNode } from "react";

interface ScreenWrapperProps {
  children: ReactNode;
  bg?: string;
}

const ScreenWrapper = ({ children, bg }: ScreenWrapperProps) => {
  const insets = useSafeAreaInsets();
  const paddingTop = insets.top > 30 ? insets.top + 5 : 30;

  return (
    <View style={{ flex: 1, backgroundColor: bg, paddingTop }}>{children}</View>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({});
