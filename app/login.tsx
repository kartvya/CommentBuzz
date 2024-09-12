import { supabase } from "@/lib/supabase";
import SvgIcon from "@/src/assets/icons/index";
import Button from "@/src/components/Button";
import Input from "@/src/components/Input";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import Spacer from "@/src/components/Spacer";
import { NormalText, TitleText } from "@/src/components/Text";
import { Colors } from "@/src/constants/Colors";
import { hp, wp } from "@/src/helpers/comman";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Keyboard, Pressable, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFValue } from "react-native-responsive-fontsize";

const Login = () => {
  const navigation = useRouter();
  const emailRef = useRef<string>("");
  const passwordRef = useRef<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, serPasswordErrorr] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [showPass, sehShowPass] = useState<boolean>(false);

  const onLogin = async () => {
    try {
      let isValid = false;
      let email = emailRef.current.trim();
      let password = passwordRef.current.trim();
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
        const {
          data: { session },
          error,
        } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });
        setLoading(false);
        Keyboard.dismiss();
        if (error) {
          Alert.alert(error.message);
        } else {
          navigation.navigate("/(tabs)/feedScreen");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <ScreenWrapper
      bg={Colors.white}
      conatinerStyle={{ paddingHorizontal: wp(4) }}
    >
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={"always"}
      >
        <Pressable
          style={styles.backIconConatiner}
          onPress={() => navigation.back()}
        >
          <SvgIcon name={"arrowLeft"} />
        </Pressable>
        <Spacer gap={hp(3)} />
        <TitleText style={styles.greetingText}>Hey,</TitleText>
        <TitleText style={styles.greetingText}>Welcome Back</TitleText>
        <Spacer gap={hp(3)} />
        <NormalText>Please login to continue</NormalText>
        <Spacer gap={hp(1)} />
        <Input
          containerStyle={{}}
          icon={<SvgIcon name={"mail"} size={26} color={Colors.icon} />}
          placeholderText="Enter your email"
          onChangeText={(txt: string) => (emailRef.current = txt)}
          error={emailError}
        />
        <Spacer gap={emailError ? wp(2) : wp(3)} />
        <Input
          containerStyle={{}}
          icon={<SvgIcon name={"lock"} size={26} color={Colors.icon} />}
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
                  color={Colors.icon}
                  strokeWidth={0.5}
                />
              ) : (
                <SvgIcon
                  name={"closeEye"}
                  size={22}
                  color={Colors.black}
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
        />
        <Spacer gap={wp(3)} />
        <View style={styles.alreadyAccount}>
          <NormalText>Don't have an account</NormalText>
          <Pressable
            style={{ marginLeft: wp(1) }}
            onPress={() => navigation.navigate("/signup")}
          >
            <NormalText style={{ color: Colors.primeColor }}>
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
});
