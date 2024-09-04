import { Pressable, StyleSheet, Text, View } from "react-native";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import LottieView from "lottie-react-native";
import { useRef } from "react";
import { hp, wp } from "@/src/helpers/comman";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Colors } from "@/src/constants/Colors";
import { NormalText, TitleText } from "@/src/components/Text";
import { useRouter } from "expo-router";
import Button from "@/src/components/Button";

const Welcome = () => {
  const animation = useRef<LottieView>(null);
  const navigation = useRouter();
  return (
    <ScreenWrapper bg="white">
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
        <View style={{ marginBottom: hp(5) }}>
          <TitleText style={styles.appNameTextStyle}>CommentBuzz</TitleText>
          <NormalText style={styles.punchLine}>
            Buzz with Comments, Earn with Impact!
          </NormalText>
          <Button
            title="Let's explore"
            btnStyle={styles.primeBtn}
            onPress={() => navigation.push("/(tabs)")}
            textStyle={styles.exploreTxt}
          />
          <View style={styles.alreadyAccount}>
            <NormalText>Already have a account</NormalText>
            <Pressable style={{ marginLeft: wp(1) }}>
              <NormalText
                style={{ color: Colors.primeColor, fontWeight: "bold" }}
              >
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
    marginHorizontal: wp(5),
    alignItems: "center",
    marginTop: hp(2),
  },
  exploreTxt: {
    color: Colors.white,
    fontWeight: "bold",
  },
  alreadyAccount: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginTop: wp(2),
  },
});
