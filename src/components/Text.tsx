import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { DarkColors } from "../constants/Colors";

interface CustomTextProps extends TextProps {
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
}

export const TitleText: React.FC<CustomTextProps> = ({
  children,
  style,
  numberOfLines,
}) => {
  return (
    <Text numberOfLines={numberOfLines} style={[styles.titleText, style]}>
      {children}
    </Text>
  );
};

export const NormalText: React.FC<CustomTextProps> = ({
  children,
  style,
  numberOfLines,
}) => {
  return (
    <Text numberOfLines={numberOfLines} style={[styles.normalText, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontSize: RFValue(16),
    color: DarkColors.text,
    fontFamily: "SpaceMono-Regular",
  },
  normalText: {
    fontSize: RFValue(12),
    color: DarkColors.text,
    fontFamily: "SpaceMono-Regular",
  },
});
