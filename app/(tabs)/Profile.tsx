import { supabase } from "@/lib/supabase";
import SvgIcon from "@/src/assets/icons";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { TitleText } from "@/src/components/Text";
import { wp } from "@/src/helpers/comman";
import { useRouter } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";

const Profile = () => {
  const navigation = useRouter();
  const onPressLogout = () => {
    try {
      Alert.alert(
        "Wait!",
        "Are you sure want to logout.",
        [
          { text: "Cancel", onPress: () => console.log("Cancel Pressed!") },
          { text: "OK", onPress: onLogoutYesBTN },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const onLogoutYesBTN = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert(
          "Sign out",
          "Something went wrong. Please try again. leater"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <ScreenWrapper>
        <View style={styles.headerConatiner}>
          <TitleText>Profile</TitleText>
          <Pressable
            style={[
              styles.backIconConatiner,
              {
                backgroundColor: "rgba(255,0,0,0.1)",
              },
            ]}
            onPress={() => onPressLogout()}
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
    paddingHorizontal: wp(3),
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
