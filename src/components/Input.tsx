import { StyleSheet, Text, TextInput, View, ViewStyle } from "react-native";
import React from "react";
import { Colors } from "../constants/Colors";
import { hp, wp } from "../helpers/comman";

interface Iprops {
  icon: any;
  containerStyle: ViewStyle;
  inputRef: any;
  placeholderText: string;
}

const Input = (props: Iprops) => {
  return (
    <View style={[styles.container, props.containerStyle]}>
      {props.icon && props.icon}
      <TextInput
        style={styles.input}
        placeholder={props.placeholderText}
        placeholderTextColor={Colors.icon}
        ref={props.inputRef && props.inputRef}
        {...props}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    padding: wp(2),
    borderRadius: 10,
    height: hp(7),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
    borderWidth: 0.5,
  },
  input: {
    flex: 1,
    backgroundColor: "transparent", // Transparent background for TextInput
    paddingLeft: wp(2), // Ensure proper padding
  },
});
