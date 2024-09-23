import Button from "@/src/components/Button";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import Spacer from "@/src/components/Spacer";
import { NormalText, TitleText } from "@/src/components/Text";
import { Colors, DarkColors } from "@/src/constants/Colors";
import { hp, wp } from "@/src/helpers/comman";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const Welcome = () => {
  const animation = useRef<LottieView>(null);
  const navigation = useRouter();
  return (
    <ScreenWrapper statusBarColor={DarkColors.backGround}>
      <View style={styles.conatiner}>
        <LottieView
          autoPlay
          ref={animation}
          style={{
            width: wp(95),
            alignSelf: "center",
            flex: 1,
          }}
          source={require("../src/assets/images/welcomeAnimation.json")}
        />
        <View style={{ marginBottom: hp(5), marginHorizontal: wp(3) }}>
          <TitleText style={styles.appNameTextStyle}>CommentBuzz</TitleText>
          <NormalText style={styles.punchLine}>
            Buzz with Comments, Earn with Impact!
          </NormalText>
          <Spacer gap={wp(2)} />
          <Button
            title="Let's explore"
            btnStyle={styles.primeBtn}
            onPress={() => navigation.push("/signup")}
            textStyle={styles.exploreTxt}
          />
          <Spacer gap={wp(2)} />
          <View style={styles.alreadyAccount}>
            <NormalText>Already have an account</NormalText>
            <Pressable
              style={{ marginLeft: wp(1) }}
              onPress={() => navigation.push("/login")}
            >
              <NormalText style={{ color: DarkColors?.primaryColor }}>
                Login
              </NormalText>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
  },
  appNameTextStyle: {
    textAlign: "center",
    fontSize: RFValue(25),
  },
  punchLine: {
    textAlign: "center",
  },
  primeBtn: {
    alignItems: "center",
  },
  exploreTxt: {
    color: Colors.white,
  },
  alreadyAccount: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
});
