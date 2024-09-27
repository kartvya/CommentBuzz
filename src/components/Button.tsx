import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { TitleText } from "./Text";
import { Colors, DarkColors, useThemeColors } from "@/src/constants/Colors";
import { hp, wp } from "../helpers/comman";
import { RFValue } from "react-native-responsive-fontsize";

interface btnProps {
  title: string;
  onPress: () => void;
  btnStyle?: StyleProp<ViewStyle>;
  hasShadow?: boolean;
  textStyle?: StyleProp<TextStyle>;
  isLoading?: boolean;
}

const Button = (props: btnProps) => {
  const {
    btnStyle,
    hasShadow = true,
    title,
    onPress,
    textStyle,
    isLoading = false,
  } = props;
  const shadowStyle = {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  };
  const themeColors = useThemeColors();
  if (isLoading) {
    return (
      <View
        style={[
          styles.button,
          { backgroundColor: themeColors.primaryColor },
          btnStyle,
        ]}
      >
        <ActivityIndicator color={themeColors.white} />
      </View>
    );
  }
  return (
    <Pressable
      style={[
        styles.button,
        { backgroundColor: themeColors.primaryColor },
        btnStyle,
        hasShadow && shadowStyle,
      ]}
      onPress={onPress}
    >
      <TitleText
        style={[styles.txt, { color: themeColors.invertedWhite }, textStyle]}
      >
        {title}
      </TitleText>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    height: hp(6),
    justifyContent: "center",
    borderRadius: wp(3),
    alignItems: "center",
  },
  txt: {
    fontSize: RFValue(17),
  },
});
