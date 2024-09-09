import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Image, ImageStyle } from "expo-image";
import { RFPercentage } from "react-native-responsive-fontsize";
import { getUserImage } from "../helpers/imageServices";

interface Iprops {
  uri: string;
  size?: number;
  borderRadius?: number;
  avatarImgStyle?: ImageStyle;
}

const Avatar = (props: Iprops) => {
  const { size, borderRadius, avatarImgStyle, uri } = props;
  return (
    <Image
      source={getUserImage(uri)}
      transition={100}
      contentFit="contain"
      style={[
        styles.image,
        { height: size, width: size, borderRadius: borderRadius },
        avatarImgStyle,
      ]}
    />
  );
};

export default Avatar;

const styles = StyleSheet.create({
  image: {
    height: RFPercentage(4),
    width: RFPercentage(4),
    overflow: "hidden",
  },
});
