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
import { Colors, DarkColors } from "@/src/constants/Colors";
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
  if (isLoading) {
    return (
      <View style={[styles.button, btnStyle]}>
        <ActivityIndicator color={Colors.white} />
      </View>
    );
  }
  return (
    <Pressable
      style={[styles.button, btnStyle, hasShadow && shadowStyle]}
      onPress={onPress}
    >
      <TitleText style={[styles.txt, textStyle]}>{title}</TitleText>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: DarkColors.primaryColor,
    height: hp(6),
    justifyContent: "center",
    borderRadius: wp(3),
    alignItems: "center",
  },
  txt: {
    fontSize: RFValue(17),
    color: Colors.white,
  },
});
