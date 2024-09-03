import { Pressable, StyleSheet, Text, View } from "react-native";
import ScreenWrapper from "./components/ScreenWrapper";
import LottieView from "lottie-react-native";
import { useRef } from "react";
import { hp } from "../app/helpers/comman";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Colors } from "@/constants/Colors";

const Welcome = () => {
  const animation = useRef<LottieView>(null);
  return (
    <ScreenWrapper bg="white">
      <View style={styles.conatiner}>
        <LottieView
          autoPlay
          ref={animation}
          style={{ height: hp(35), marginTop: 40 }}
          source={require("../assets/images/welcomeAnimation.json")}
        />
        <View style={{ marginVertical: hp(20) }}>
          <Text style={styles.appNameTextStyle}>CommentBuzz!</Text>
          <Text style={styles.punchLine}>
            Buzz with Comments, Earn with Impact!
          </Text>
        </View>

        <View style={{ marginBottom: hp(10) }}>
          <Pressable style={styles.primeBtn}>
            <Text>Go live</Text>
          </Pressable>
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
    fontSize: 30,
  },
  punchLine: {
    textAlign: "center",
    fontSize: 15,
  },
  primeBtn: {
    backgroundColor: Colors.dark.primeColor,
  },
});
