import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useRef } from "react";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { Colors } from "@/src/constants/Colors";
import { hp, wp } from "@/src/helpers/comman";
import { useRouter } from "expo-router";
import SvgIcon from "@/src/assets/icons";
import Spacer from "@/src/components/Spacer";
import { NormalText, TitleText } from "@/src/components/Text";
import Input from "@/src/components/Input";
import Button from "@/src/components/Button";
import { RFValue } from "react-native-responsive-fontsize";

const Signup = () => {
  const navigation = useRouter();
  const emailRef = useRef<TextInput>(null);
  const userNameRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  return (
    <ScreenWrapper
      bg={Colors.white}
      conatinerStyle={{ paddingHorizontal: wp(4) }}
    >
      <Pressable
        style={styles.backIconConatiner}
        onPress={() => navigation.navigate("/welcome")}
      >
        <SvgIcon name={"arrowLeft"} />
      </Pressable>
      <Spacer gap={hp(3)} />
      <TitleText style={styles.greetingText}>Let's,</TitleText>
      <TitleText style={styles.greetingText}>Get Started</TitleText>
      <Spacer gap={hp(3)} />
      <NormalText>Please fill the details to create account.</NormalText>
      <Spacer gap={hp(1)} />
      <Input
        inputRef={userNameRef}
        containerStyle={{}}
        icon={<SvgIcon name={"user"} size={26} color={Colors.icon} />}
        placeholderText="Enter your username"
      />
      <Spacer gap={wp(3)} />
      <Input
        inputRef={emailRef}
        containerStyle={{}}
        icon={<SvgIcon name={"mail"} size={26} color={Colors.icon} />}
        placeholderText="Enter your email"
      />
      <Spacer gap={wp(3)} />
      <Input
        inputRef={passwordRef}
        containerStyle={{}}
        icon={<SvgIcon name={"lock"} size={26} color={Colors.icon} />}
        placeholderText="Enter your password"
        secureTextEntry={true}
      />
      <Spacer gap={wp(3)} />
      <Button
        title="Register"
        btnStyle={{ alignItems: "center" }}
        onPress={() => console.log("Check")}
      />
      <Spacer gap={wp(3)} />
      <View style={styles.alreadyAccount}>
        <NormalText>Already have an account</NormalText>
        <Pressable
          style={{ marginLeft: wp(1) }}
          onPress={() => navigation.navigate("/login")}
        >
          <NormalText style={{ color: Colors.primeColor }}>Login</NormalText>
        </Pressable>
      </View>
    </ScreenWrapper>
  );
};

export default Signup;

const styles = StyleSheet.create({
  greetingText: {
    fontSize: RFValue(30),
  },
  backIconConatiner: {
    backgroundColor: "rgba(0,0,0,0.1)",
    alignSelf: "flex-start",
    borderRadius: 5,
    height: wp(8),
    width: wp(8),
    alignItems: "center",
    justifyContent: "center",
  },
  alreadyAccount: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  forgotPasswordText: {
    textAlign: "right",
  },
});
