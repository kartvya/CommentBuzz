import { Image, ImageStyle } from "expo-image";
import { StyleSheet } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { getUserImage } from "../services/imageServices";

interface Iprops {
  uri: string | null;
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
      contentFit="cover"
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
  },
});
