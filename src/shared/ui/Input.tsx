import React from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { Colors, useThemeColors } from "@/src/shared/constants/colors";
import { hp, wp } from "../utils/comman";
import { NormalText } from "./Text";

interface Iprops extends TextInputProps {
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputRef?: React.RefObject<TextInput>;
  placeholderText?: string;
  error?: string;
  rightIcon?: React.ReactNode;
}

const Input: React.FC<Iprops> = (props) => {
  const themeColors = useThemeColors();
  return (
    <>
      <View
        style={[
          styles.container,
          { backgroundColor: themeColors.lightBg },
          props.containerStyle,
        ]}
      >
        {props.icon && props.icon}
        <TextInput
          style={[styles.input, { color: themeColors.text }]}
          placeholder={props.placeholderText}
          placeholderTextColor={themeColors.icon}
          ref={props.inputRef && props.inputRef}
          {...props}
        />
        {props.rightIcon && props.rightIcon}
      </View>
      {props.error && (
        <NormalText style={styles.errorText}>{props.error}</NormalText>
      )}
    </>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    height: hp(7),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
  },
  input: {
    flex: 1,
    backgroundColor: "trasparent",
    paddingLeft: wp(2),
    fontFamily: "SpaceMono-Regular",
    height: hp(7),
  },
  errorText: {
    color: Colors.red,
    fontSize: RFValue(10),
  },
});
