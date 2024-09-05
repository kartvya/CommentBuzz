import ScreenWrapper from "@/src/components/ScreenWrapper";
import { Colors } from "@/src/constants/Colors";
import { Pressable, StyleSheet, Text, View } from "react-native";
import SvgIcon from "@/src/assets/icons/index";
import Input from "@/src/components/Input";
import { useRef } from "react";
import { TitleText } from "@/src/components/Text";
import { RFValue } from "react-native-responsive-fontsize";
import { hp, wp } from "@/src/helpers/comman";
import Spacer from "@/src/components/Spacer";
import { useRouter } from "expo-router";

const Login = () => {
  const navigation = useRouter();
  const emailRef = useRef("");
  return (
    <ScreenWrapper
      bg={Colors.white}
      conatinerStyle={{ paddingHorizontal: wp(3) }}
    >
      <Pressable
        style={styles.backIconConatiner}
        onPress={() => navigation.back()}
      >
        <SvgIcon name={"arrowLeft"} />
      </Pressable>
      <View style={{}}>
        <TitleText style={styles.greetingText}>Hey,</TitleText>
        <TitleText style={styles.greetingText}>Welcome Back</TitleText>
      </View>
      <Input
        inputRef={emailRef}
        containerStyle={{}}
        icon={<SvgIcon name={"mail"} size={26} color={Colors.icon} />}
        placeholderText="test@gamil.com..."
      />
      <Spacer gap={wp(3)} />
      <Input
        inputRef={emailRef}
        containerStyle={{}}
        icon={<SvgIcon name={"mail"} size={26} color={Colors.icon} />}
        placeholderText="test@gamil.com..."
      />
      <Spacer gap={wp(3)} />
    </ScreenWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({
  greetingText: {
    fontSize: RFValue(30),
  },
  backIconConatiner: {
    backgroundColor: "rgba(0,0,0,0.2)",
    alignSelf: "flex-start",
    borderRadius: 5,
    height: wp(8),
    width: wp(8),
    alignItems: "center",
    justifyContent: "center",
  },
});
