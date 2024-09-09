import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { TitleText } from "./Text";
import SvgIcon from "../assets/icons";
import { wp } from "../helpers/comman";
import { useRouter } from "expo-router";

interface IProps {
  title: string;
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
          <SvgIcon name={"arrowLeft"} />
        </Pressable>
      ) : (
        <View style={{ width: wp(8) }} />
      )}
      <TitleText>{title}</TitleText>
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
    marginHorizontal: wp(3),
  },
  backIconConatiner: {
    backgroundColor: "rgba(0,0,0,0.1)",
    alignSelf: "flex-start",
    borderRadius: 10,
    height: wp(8),
    width: wp(8),
    alignItems: "center",
    justifyContent: "center",
  },
});
