import { supabase } from "@/lib/supabase";
import SvgIcon from "@/src/assets/icons";
import Button from "@/src/components/Button";
import Input from "@/src/components/Input";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import Spacer from "@/src/components/Spacer";
import { NormalText, TitleText } from "@/src/components/Text";
import { Colors, DarkColors } from "@/src/constants/Colors";
import { hp, wp } from "@/src/helpers/comman";
import { isEmailValid, isPasswordValid } from "@/src/helpers/validation";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFValue } from "react-native-responsive-fontsize";

const Signup = () => {
  const navigation = useRouter();
  const emailRef = useRef<string>("");
  const userNameRef = useRef<string>("");
  const passwordRef = useRef<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [userNameError, setUserNameError] = useState<string>("");
  const [passwordError, serPasswordErrorr] = useState<string>("");
  const [showPass, sehShowPass] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string>("");

  const onSignUp = async () => {
    try {
      let isValid = false;
      let email = emailRef.current.trim();
      let userName = userNameRef.current.trim();
      let password = passwordRef.current.trim();
      if (!email) {
        isValid = false;
        setEmailError("This field is required.");
      } else if (!isEmailValid(email)) {
        isValid = false;
        setEmailError("Invalid email format.");
      } else {
        isValid = true;
        setEmailError("");
      }
      if (!userName) {
        isValid = false;
        setUserNameError("This field is required.");
      } else {
        isValid = true;
        setUserNameError("");
      }
      if (!password) {
        isValid = false;
        serPasswordErrorr("This field is required.");
      } else if (!isPasswordValid(password)) {
        isValid = false;
        serPasswordErrorr("Please select strong password!");
      } else {
        isValid = true;
        serPasswordErrorr("");
      }
      setIsLoading(true);
      if (isValid) {
        const {
          data: { session },
          error,
        } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              name: userName,
              buzzCoins: 0,
            },
          },
        });
        if (error) {
          setGlobalError(error?.message);
        } else {
          setGlobalError("");
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScreenWrapper
      statusBarColor={DarkColors?.backGround}
      conatinerStyle={{ paddingHorizontal: wp(4) }}
    >
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={"always"}
        enableOnAndroid
        extraScrollHeight={20}
        extraHeight={20}
      >
        <Pressable
          style={styles.backIconConatiner}
          onPress={() => navigation.navigate("/welcome")}
        >
          <SvgIcon name={"arrowLeft"} color={DarkColors?.primaryColor} />
        </Pressable>
        <Spacer gap={hp(2)} />
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
          maxLength={20}
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
          secureTextEntry={showPass ? false : true}
          onChangeText={(txt) => (passwordRef.current = txt)}
          error={passwordError}
          rightIcon={
            <Pressable onPress={() => sehShowPass(!showPass)}>
              <SvgIcon
                name={showPass ? "eye" : "closeEye"}
                size={22}
                color={DarkColors.text}
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
        />
        <NormalText style={styles.errorText}>{globalError}</NormalText>
        <Spacer gap={wp(3)} />
        <View style={styles.alreadyAccount}>
          <NormalText>Already have an account</NormalText>
          <Pressable
            style={{ marginLeft: wp(1) }}
            onPress={() => navigation.navigate("/login")}
          >
            <NormalText style={{ color: DarkColors.primaryColor }}>
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
    backgroundColor: "rgba(0,0,0,1)",
    alignSelf: "flex-start",
    borderRadius: 10,
    height: wp(8),
    width: wp(8),
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
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
