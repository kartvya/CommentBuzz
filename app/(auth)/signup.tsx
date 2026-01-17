import SvgIcon from "@/src/assets/icons";
import Button from "@/src/shared/ui/Button";
import Input from "@/src/shared/ui/Input";
import ScreenWrapper from "@/src/shared/ui/ScreenWrapper";
import Spacer from "@/src/shared/ui/Spacer";
import { NormalText, TitleText } from "@/src/shared/ui/Text";
import {
  Colors,
  DarkColors,
  useThemeColors,
} from "@/src/shared/constants/colors";
import { hp, wp } from "@/src/shared/utils/comman";
import { useSignup } from "@/src/modules/auth/hooks/useSignup";
import { Href, useRouter } from "expo-router";
import { useRef, useState, useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFValue } from "react-native-responsive-fontsize";

const Signup = () => {
  const {
    signup,
    isLoading,
    error: signupError,
    validationErrors,
  } = useSignup();

  const navigation = useRouter();
  const themeColors = useThemeColors();
  const emailRef = useRef<string>("");
  const userNameRef = useRef<string>("");
  const passwordRef = useRef<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [userNameError, setUserNameError] = useState<string>("");
  const [passwordError, serPasswordErrorr] = useState<string>("");
  const [showPass, sehShowPass] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string>("");

  // Update error states from validation errors
  useEffect(() => {
    if (validationErrors) {
      if (validationErrors.email) {
        setEmailError(validationErrors.email[0] || "");
      } else {
        setEmailError("");
      }
      if (validationErrors.username) {
        setUserNameError(validationErrors.username[0] || "");
      } else {
        setUserNameError("");
      }
      if (validationErrors.password) {
        serPasswordErrorr(validationErrors.password[0] || "");
      } else {
        serPasswordErrorr("");
      }
    } else {
      setEmailError("");
      setUserNameError("");
      serPasswordErrorr("");
    }
  }, [validationErrors]);

  const onSignUp = async () => {
    try {
      // Signup use case handles validation and trimming
      const result = await signup({
        username: userNameRef.current,
        email: emailRef.current,
        password: passwordRef.current,
      });

      if (result.success) {
        navigation.navigate("/login" as Href);
      }
    } catch (error) {
      // Error handling is done by the hook
      if (signupError) {
        setGlobalError(
          signupError.message || "Signup failed. Please try again."
        );
      }
    }
  };

  return (
    <ScreenWrapper
      statusBarColor={themeColors?.backGround}
      conatinerStyle={{ paddingHorizontal: wp(4) }}
    >
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={"always"}
        enableOnAndroid={false}
        extraScrollHeight={20}
        extraHeight={20}
      >
        <Pressable
          style={styles.backIconConatiner}
          onPress={() => navigation.navigate("/welcome" as Href)}
        >
          <SvgIcon name={"arrowLeft"} color={themeColors?.primaryColor} />
        </Pressable>
        <Spacer gap={hp(2)} />
        <TitleText style={styles.greetingText}>Let's,</TitleText>
        <TitleText style={styles.greetingText}>Get Started</TitleText>
        <Spacer gap={hp(3)} />
        <NormalText>Please fill the details to create account.</NormalText>
        <Spacer gap={hp(1)} />
        <Input
          containerStyle={{}}
          icon={<SvgIcon name={"user"} size={26} color={themeColors.icon} />}
          placeholderText="Enter your username"
          onChangeText={(txt) => (userNameRef.current = txt)}
          error={userNameError}
          maxLength={20}
        />
        <Spacer gap={userNameError ? wp(2) : wp(3)} />
        <Input
          containerStyle={{}}
          icon={<SvgIcon name={"mail"} size={26} color={themeColors.icon} />}
          placeholderText="Enter your email"
          onChangeText={(txt) => (emailRef.current = txt)}
          error={emailError}
        />
        <Spacer gap={emailError ? wp(2) : wp(3)} />
        <Input
          containerStyle={{}}
          icon={<SvgIcon name={"lock"} size={26} color={themeColors.icon} />}
          placeholderText="Enter your password"
          secureTextEntry={showPass ? false : true}
          onChangeText={(txt) => (passwordRef.current = txt)}
          error={passwordError}
          rightIcon={
            <Pressable onPress={() => sehShowPass(!showPass)}>
              <SvgIcon
                name={showPass ? "eye" : "closeEye"}
                size={22}
                color={themeColors.text}
              />
            </Pressable>
          }
        />
        <Spacer gap={passwordError ? wp(2) : wp(3)} />
        <Button
          title="Register"
          btnStyle={{ alignItems: "center" }}
          onPress={() => onSignUp()}
          isLoading={isLoading}
          textStyle={{
            color: DarkColors.white,
          }}
        />
        <NormalText style={styles.errorText}>{globalError}</NormalText>
        <Spacer gap={wp(3)} />
        <View style={styles.alreadyAccount}>
          <NormalText>Already have an account</NormalText>
          <Pressable
            style={{ marginLeft: wp(1) }}
            onPress={() => navigation.navigate("/login")}
          >
            <NormalText style={{ color: themeColors.primaryColor }}>
              Login
            </NormalText>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
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
    borderRadius: 10,
    height: wp(8),
    width: wp(8),
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  alreadyAccount: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  forgotPasswordText: {
    textAlign: "right",
  },
  errorText: {
    color: Colors.red,
    fontSize: RFValue(10),
  },
});
