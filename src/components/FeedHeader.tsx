import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import SvgIcon from "../assets/icons";
import { DarkColors, useThemeColors } from "../constants/Colors";
import { wp } from "../helpers/comman";
import Spacer from "./Spacer";
import { TitleText } from "./Text";

const FeedHeader = () => {
  const navigation = useRouter();
  const themeColors = useThemeColors();
  return (
    <>
      <View style={styles.conatiner}>
        <TitleText style={styles.headerTitleText}>Comment Buzz</TitleText>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <SvgIcon name={"heart"} color={themeColors?.text} />
          <Spacer gap={wp(1)} />
          <Pressable onPress={() => navigation.navigate("/uploadPost")}>
            <SvgIcon name={"plus"} color={themeColors?.text} />
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default FeedHeader;

const styles = StyleSheet.create({
  headerTitleText: {
    fontSize: RFValue(20),
  },
  conatiner: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: wp(3),
    justifyContent: "space-between",
  },
  mainConatiner: {
    backgroundColor: "white",
    paddingBottom: wp(2),
  },
});
