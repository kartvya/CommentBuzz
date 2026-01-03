import SvgIcon from "@/src/assets/icons/index";
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
import { USERINFO } from "@/src/redux/actions/ActionType";
import { useLoginMutation } from "@/src/infrastructure/api/authApi";
import { useLazyGetUserProfileDetailsQuery } from "@/src/infrastructure/api/userApi";
import { tokenStorage } from "@/src/infrastructure/storage/tokenStorage";
import { Href, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFValue } from "react-native-responsive-fontsize";
import { useDispatch } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();

  const [login] = useLoginMutation();
  const [GetUserDetails] = useLazyGetUserProfileDetailsQuery();

  const navigation = useRouter();
  const themeColors = useThemeColors();
  const emailRef = useRef<string>("");
  const passwordRef = useRef<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, serPasswordErrorr] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [showPass, sehShowPass] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string>("");

  const onLogin = async () => {
    try {
      let isValid = false;
      // let email = emailRef.current.trim();
      // let password = passwordRef.current.trim();
      let email = "vishal@gmail.com";
      let password = "Abc@1234";
      if (!email) {
        setEmailError("This field is required.");
        isValid = false;
      } else {
        setEmailError("");
        isValid = true;
      }
      if (!password) {
        serPasswordErrorr("This field is required.");
        isValid = false;
      } else {
        serPasswordErrorr("");
        isValid = true;
      }
      if (isValid) {
        setLoading(true);
        let loginCred = { email: email, password: password };
        const loginResponse = await login(loginCred).unwrap();
        await tokenStorage.setAccessToken(loginResponse?.data?.accessToken);
        await tokenStorage.setRefreshToken(loginResponse?.data?.refreshToken);
        let userProfileDetails = await GetUserDetails().unwrap();
        dispatch({
          type: USERINFO,
          payload: userProfileDetails?.user,
        });
        navigation.navigate("/(drawer)/(tabs)/feedScreen" as Href);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <ScreenWrapper
      conatinerStyle={{ paddingHorizontal: wp(4) }}
      statusBarColor={themeColors?.backGround}
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
          onPress={() => navigation.back()}
        >
          <SvgIcon name={"arrowLeft"} color={themeColors?.primaryColor} />
        </Pressable>
        <Spacer gap={hp(2)} />
        <TitleText style={styles.greetingText}>Hey,</TitleText>
        <TitleText style={styles.greetingText}>Welcome Back</TitleText>
        <Spacer gap={hp(3)} />
        <NormalText>Please login to continue</NormalText>
        <Spacer gap={hp(1)} />
        <Input
          containerStyle={{}}
          icon={<SvgIcon name={"mail"} size={26} color={themeColors.icon} />}
          placeholderText="Enter your email"
          onChangeText={(txt: string) => (emailRef.current = txt)}
          error={emailError}
        />
        <Spacer gap={emailError ? wp(2) : wp(3)} />
        <Input
          containerStyle={{}}
          icon={<SvgIcon name={"lock"} size={26} color={themeColors.icon} />}
          placeholderText="Enter your password"
          secureTextEntry={showPass ? false : true}
          onChangeText={(txt: string) => (passwordRef.current = txt)}
          error={passwordError}
          rightIcon={
            <Pressable onPress={() => sehShowPass(!showPass)}>
              {showPass ? (
                <SvgIcon
                  name={"eye"}
                  size={22}
                  color={themeColors.text}
                  strokeWidth={0.5}
                />
              ) : (
                <SvgIcon
                  name={"closeEye"}
                  size={22}
                  color={themeColors.text}
                  strokeWidth={2}
                />
              )}
            </Pressable>
          }
        />
        <Spacer gap={passwordError ? wp(2) : wp(3)} />
        <NormalText style={styles.forgotPasswordText}>
          Forgot password?
        </NormalText>
        <Spacer gap={wp(3)} />
        <Button
          title="Login"
          btnStyle={{ alignItems: "center" }}
          onPress={() => onLogin()}
          isLoading={isLoading}
          textStyle={{
            color: DarkColors.white,
          }}
        />
        <NormalText style={styles.errorText}>{globalError}</NormalText>
        <Spacer gap={wp(3)} />
        <View style={styles.alreadyAccount}>
          <NormalText>Don't have an account</NormalText>
          <Pressable
            style={{ marginLeft: wp(1) }}
            onPress={() => navigation.navigate("/signup")}
          >
            <NormalText style={{ color: themeColors.primaryColor }}>
              Register
            </NormalText>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </ScreenWrapper>
  );
};

export default Login;

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
  container: {
    flex: 1,
  },
  errorText: {
    color: Colors.red,
    fontSize: RFValue(10),
  },
});
