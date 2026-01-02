import { Image, ImageStyle } from "expo-image";
import { Pressable, PressableProps, StyleSheet } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { getUserImage } from "../services/imageServices";

interface Iprops extends PressableProps {
  uri: string | null;
  size?: number;
  borderRadius?: number;
  avatarImgStyle?: ImageStyle;
}

const Avatar = (props: Iprops) => {
  const { size, borderRadius, avatarImgStyle, uri, ...rest } = props;
  console.log("uri", getUserImage(uri));

  return (
    <Pressable {...rest}>
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
    </Pressable>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  image: {
    height: RFPercentage(4),
    width: RFPercentage(4),
  },
});
