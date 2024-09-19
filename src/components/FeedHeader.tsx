import { Pressable, StyleSheet, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SvgIcon from "../assets/icons";
import { wp } from "../helpers/comman";
import Spacer from "./Spacer";
import { TitleText } from "./Text";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { DarkColors } from "../constants/Colors";

const FeedHeader = () => {
  const insets = useSafeAreaInsets();
  const navigation = useRouter();
  const paddingTop = insets.top > 30 ? insets.top + 5 : 30;
  return (
    <>
      <View style={styles.conatiner}>
        <TitleText style={styles.headerTitleText}>Comment Buzz</TitleText>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <SvgIcon name={"heart"} color={DarkColors?.text} />
          <Spacer gap={wp(1)} />
          <Pressable onPress={() => navigation.navigate("/uploadPost")}>
            <SvgIcon name={"plus"} color={DarkColors?.text} />
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
