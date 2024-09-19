import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { Colors, DarkColors } from "../constants/Colors";
import { hp, wp } from "../helpers/comman";
import { NormalText } from "./Text";
import { RFValue } from "react-native-responsive-fontsize";

interface Iprops extends TextInputProps {
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputRef?: React.RefObject<TextInput>;
  placeholderText?: string;
  error?: string;
  rightIcon?: React.ReactNode;
}

const Input: React.FC<Iprops> = (props) => {
  return (
    <>
      <View style={[styles.container, props.containerStyle]}>
        {props.icon && props.icon}
        <TextInput
          style={styles.input}
          placeholder={props.placeholderText}
          placeholderTextColor={Colors.icon}
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
    backgroundColor: DarkColors.lightBg,
    padding: wp(2),
    borderRadius: 10,
    height: hp(7),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    paddingLeft: wp(2),
    fontFamily: "SpaceMono-Regular",
    color: DarkColors.text,
  },
  errorText: {
    color: Colors.red,
    fontSize: RFValue(10),
  },
});
