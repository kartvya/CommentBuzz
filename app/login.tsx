import SvgIcon from "@/src/assets/icons/index";
import Button from "@/src/components/Button";
import Input from "@/src/components/Input";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import Spacer from "@/src/components/Spacer";
import { NormalText, TitleText } from "@/src/components/Text";
import { Colors } from "@/src/constants/Colors";
import { hp, wp } from "@/src/helpers/comman";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { Alert, Pressable, StyleSheet, TextInput, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const Login = () => {
  const navigation = useRouter();
  const emailRef = useRef<string>("");
  const passwordRef = useRef<string>("");

  const onLogin = () => {
    try {
      if (!emailRef.current || !passwordRef.current) {
        Alert.alert("Login", "Please fill all the fileds!");
      } else {
        navigation.navigate("/(tabs)/feedScreen");
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
        // inputRef={emailRef}
        containerStyle={{}}
        icon={<SvgIcon name={"mail"} size={26} color={Colors.icon} />}
        placeholderText="Enter your email"
        onChangeText={(txt) => (emailRef.current = txt)}
      />
      <Spacer gap={wp(3)} />
      <Input
        // inputRef={passwordRef}
        containerStyle={{}}
        icon={<SvgIcon name={"lock"} size={26} color={Colors.icon} />}
        placeholderText="Enter your password"
        secureTextEntry={true}
        onChangeText={(txt) => (passwordRef.current = txt)}
      />
      <Spacer gap={wp(3)} />
      <NormalText style={styles.forgotPasswordText}>
        Forgot password?
      </NormalText>
      <Spacer gap={wp(3)} />
      <Button
        title="Login"
        btnStyle={{ alignItems: "center" }}
        onPress={() => onLogin()}
      />
      <Spacer gap={wp(3)} />
      <View style={styles.alreadyAccount}>
        <NormalText>Don't have an account</NormalText>
        <Pressable
          style={{ marginLeft: wp(1) }}
          onPress={() => navigation.navigate("/signup")}
        >
          <NormalText style={{ color: Colors.primeColor }}>Register</NormalText>
        </Pressable>
      </View>
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
