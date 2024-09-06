import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import SvgIcon from "@/src/assets/icons";
import { useRouter } from "expo-router";
import { wp } from "@/src/helpers/comman";
import { TitleText } from "@/src/components/Text";
import MyStatusBar from "@/src/components/CustomeStatusBar";
import { Colors } from "@/src/constants/Colors";

const Profile = () => {
  const navigation = useRouter();
  return (
    <>
      <ScreenWrapper>
        <View style={styles.headerConatiner}>
          <Pressable
            style={styles.backIconConatiner}
            onPress={() => navigation.back()}
          >
            <SvgIcon name={"arrowLeft"} />
          </Pressable>
          <TitleText>Profile</TitleText>
          <Pressable
            style={[
              styles.backIconConatiner,
              {
                backgroundColor: "rgba(255,0,0,0.1)",
              },
            ]}
            onPress={() => navigation.navigate("/welcome")}
          >
            <SvgIcon name={"logout"} />
          </Pressable>
        </View>
        <Text>Profile</Text>
      </ScreenWrapper>
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  headerConatiner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(2),
    backgroundColor: "white",
    paddingBottom: wp(3),
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
});
