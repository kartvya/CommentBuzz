import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
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
import { supabase } from "@/lib/supabase";
import { useStoreRootState } from "expo-router/build/global-state/router-store";
import { isEmailValid, isPasswordValid } from "@/src/helpers/validation";

const Signup = () => {
  const navigation = useRouter();
  const emailRef = useRef<string>("");
  const userNameRef = useRef<string>("");
  const passwordRef = useRef<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [userNameError, setUserNameError] = useState<string>("");
  const [passwordError, serPasswordErrorr] = useState<string>("");

  const onSignUp = async () => {
    try {
      let email = emailRef.current.trim();
      let userName = userNameRef.current.trim();
      let password = passwordRef.current.trim();
      if (!email) {
        setEmailError("This field is required.");
      } else if (!isEmailValid(email)) {
        setEmailError("Invalid email format.");
      } else {
        setEmailError("");
      }
      if (!userName) {
        setUserNameError("This field is required.");
      } else {
        setUserNameError("");
      }
      if (!password) {
        serPasswordErrorr("This field is required.");
      } else if (!isPasswordValid(password)) {
        serPasswordErrorr("Please select strong password!");
      } else {
        serPasswordErrorr("");
      }
      setIsLoading(true);
      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: userName,
          },
        },
      });

      setIsLoading(false);
      navigation.navigate("/login");
      // console.log("session", session);
      // console.log("error", error);
    } catch (error) {
      console.log(error);
    }
  };

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
        containerStyle={{}}
        icon={<SvgIcon name={"user"} size={26} color={Colors.icon} />}
        placeholderText="Enter your username"
        onChangeText={(txt) => (userNameRef.current = txt)}
        error={userNameError}
      />
      <Spacer gap={userNameError ? wp(2) : wp(3)} />
      <Input
        containerStyle={{}}
        icon={<SvgIcon name={"mail"} size={26} color={Colors.icon} />}
        placeholderText="Enter your email"
        onChangeText={(txt) => (emailRef.current = txt)}
        error={emailError}
      />
      <Spacer gap={emailError ? wp(2) : wp(3)} />
      <Input
        containerStyle={{}}
        icon={<SvgIcon name={"lock"} size={26} color={Colors.icon} />}
        placeholderText="Enter your password"
        secureTextEntry={true}
        onChangeText={(txt) => (passwordRef.current = txt)}
        error={passwordError}
      />
      <Spacer gap={passwordError ? wp(2) : wp(3)} />
      <Button
        title="Register"
        btnStyle={{ alignItems: "center" }}
        onPress={() => onSignUp()}
        isLoading={isLoading}
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
