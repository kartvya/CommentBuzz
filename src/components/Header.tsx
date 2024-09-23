import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { TitleText } from "./Text";
import SvgIcon from "../assets/icons";
import { wp } from "../helpers/comman";
import { useRouter } from "expo-router";
import { DarkColors } from "../constants/Colors";

interface IProps {
  title?: string;
  showBackIcon: boolean;
  mb?: number;
}

const Header = (props: IProps) => {
  const { title, showBackIcon, mb } = props;
  const navigation = useRouter();
  return (
    <View style={[styles.headerConatiner, { marginBottom: mb }]}>
      {showBackIcon ? (
        <Pressable
          style={[styles.backIconConatiner]}
          onPress={() => navigation.back()}
        >
          <SvgIcon name={"arrowLeft"} color={DarkColors?.primaryColor} />
        </Pressable>
      ) : (
        <View style={{ width: wp(8) }} />
      )}
      <TitleText style={{ color: DarkColors?.text }}>{title}</TitleText>
      <View style={{ width: wp(8) }} />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerConatiner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(3),
    paddingBottom: wp(3),
    backgroundColor: DarkColors?.lightBg,
  },
  backIconConatiner: {
    backgroundColor: "rgba(0,0,0,1)",
    alignSelf: "flex-start",
    borderRadius: 10,
    height: wp(8),
    width: wp(8),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
