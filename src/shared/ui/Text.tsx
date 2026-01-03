import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useThemeColors } from "@/src/shared/constants/colors";

interface CustomTextProps extends TextProps {
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
}

export const TitleText: React.FC<CustomTextProps> = ({
  children,
  style,
  numberOfLines,
}) => {
  const themeColors = useThemeColors();
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[styles.titleText, { color: themeColors.text }, style]}
    >
      {children}
    </Text>
  );
};

export const NormalText: React.FC<CustomTextProps> = ({
  children,
  style,
  numberOfLines,
}) => {
  const themeColors = useThemeColors();
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[styles.normalText, { color: themeColors.text }, style]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontSize: RFValue(16),
    fontFamily: "SpaceMono-Regular",
  },
  normalText: {
    fontSize: RFValue(12),
    fontFamily: "SpaceMono-Regular",
  },
});
