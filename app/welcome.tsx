import Button from "@/src/components/Button";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import Spacer from "@/src/components/Spacer";
import { NormalText, TitleText } from "@/src/components/Text";
import { Colors, DarkColors, useThemeColors } from "@/src/constants/Colors";
import { hp, wp } from "@/src/helpers/comman";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect, useRef } from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { RFValue } from "react-native-responsive-fontsize";

const screenDimensions = Dimensions.get("screen");

const Welcome = () => {
  const animation = useRef<LottieView>(null);
  const navigation = useRouter();
  const themeColors = useThemeColors();
  const descriptionAnimation = useSharedValue(screenDimensions.height * 0.8);
  const descriptionStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(descriptionAnimation.value, {
            duration: 1200,
          }),
        },
      ],
    };
  });
  const startAnimation = async () => {
    descriptionAnimation.value = screenDimensions.height * 0.001;
  };

  useEffect(() => {
    startAnimation();
  }, []);

  return (
    <ScreenWrapper statusBarColor={themeColors.backGround}>
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
        <Animated.View
          style={[
            {
              paddingBottom: hp(5),
              paddingHorizontal: wp(3),
            },
            descriptionStyle,
          ]}
        >
          <TitleText style={styles.appNameTextStyle}>CommentBuzz</TitleText>
          <NormalText style={styles.punchLine}>
            Buzz with Comments, Earn with Impact!
          </NormalText>
          <Spacer gap={wp(2)} />
          <Button
            title="Let's explore"
            btnStyle={styles.primeBtn}
            onPress={() => navigation.push("/signup")}
            textStyle={{
              color: DarkColors.white,
            }}
          />
          <Spacer gap={wp(2)} />
          <View style={styles.alreadyAccount}>
            <NormalText>Already have an account</NormalText>
            <Pressable
              style={{ marginLeft: wp(1) }}
              onPress={() => navigation.push("/login")}
            >
              <NormalText style={{ color: themeColors?.primaryColor }}>
                Login
              </NormalText>
            </Pressable>
          </View>
        </Animated.View>
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
