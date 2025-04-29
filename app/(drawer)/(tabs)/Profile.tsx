import { supabase } from "@/lib/supabase";
import SvgIcon from "@/src/assets/icons";
import Avatar from "@/src/components/Avatar";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import Spacer from "@/src/components/Spacer";
import { NormalText, TitleText } from "@/src/components/Text";
import { useThemeColors } from "@/src/constants/Colors";
import { wp } from "@/src/helpers/comman";
import { Users } from "@/src/redux/reducers/AuthReducer";
import { RootState } from "@/src/redux/Store";
import UserAbout from "@/src/tabsScreens/UserAbout";
import UserComments from "@/src/tabsScreens/UserComments";
import UserPost from "@/src/tabsScreens/UserPost";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { useSelector } from "react-redux";

interface Routes {
  key: string;
  title: string;
}

const renderScene = SceneMap({
  first: () => <UserPost />,
  second: () => <UserComments />,
  third: () => <UserAbout />,
});

const Profile = () => {
  const navigationDrawer = useNavigation();
  const navigation = useRouter();
  const layout = useWindowDimensions();
  const themeColors = useThemeColors();

  const UserInfo = useSelector(
    (state: RootState) => state.root?.authReducer?.userInfo
  ) as Users;

  const [index, setIndex] = useState<number>(0);
  const [routes] = useState<Routes[]>([
    { key: "first", title: "Posts" },
    { key: "second", title: "Comments" },
    { key: "third", title: "About" },
  ]);

  const onPressLogout = () => {
    try {
      Alert.alert(
        "Confirm",
        "Are you sure want to log out?",
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

  const onPressDrawer = () => {
    try {
      //@ts-ignore
      navigationDrawer?.openDrawer();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ScreenWrapper>
        <View
          style={[
            styles.headerConatiner,
            { backgroundColor: themeColors?.lightBg },
          ]}
        >
          <TitleText style={{ color: themeColors.text }}>Profile</TitleText>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Spacer gap={RFPercentage(0.5)} />
            <Pressable
              style={[styles.backIconConatiner, {}]}
              onPress={onPressDrawer}
            >
              <SvgIcon
                name={"hamburgerMenu"}
                color={themeColors.text}
                strokeWidth={0.1}
                size={20}
              />
            </Pressable>
          </View>
        </View>
        <View style={styles.avtarWithTextContainer}>
          <Pressable
            style={[
              styles.avtarConatiner,
              { backgroundColor: themeColors.white },
            ]}
            onPress={() => navigation.navigate("/(main)/editProfile")}
          >
            <Avatar
              uri={UserInfo?.image}
              size={RFPercentage(10)}
              borderRadius={20}
            />
            <View
              style={[
                styles.editConatiner,
                { backgroundColor: themeColors?.votesBg },
              ]}
            >
              <SvgIcon name={"edit"} size={18} color={themeColors?.text} />
            </View>
          </Pressable>
          <Spacer gap={RFPercentage(1)} />
          <View style={{ flex: 1 }}>
            <TitleText style={styles.userNameText}>{UserInfo?.name}</TitleText>
            {UserInfo?.bio && (
              <NormalText ellipsizeMode="tail" numberOfLines={2}>
                {UserInfo?.bio}
              </NormalText>
            )}
          </View>
          <Spacer gap={RFPercentage(1)} />
        </View>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              renderLabel={() => null}
              renderIcon={({ route }: { route: any }) => (
                <View style={{}}>
                  <NormalText
                    style={{
                      marginVertical: RFPercentage(1),
                      fontSize: RFValue(10),
                    }}
                    numberOfLines={1}
                  >
                    {route.title}
                  </NormalText>
                </View>
              )}
              style={{ backgroundColor: themeColors.lightBg }}
              labelStyle={{ fontSize: 12 }}
              inactiveColor="gray"
              indicatorStyle={{
                backgroundColor: themeColors?.primaryColor,
              }}
            />
          )}
        />
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
    paddingBottom: wp(3),
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
  avtarConatiner: {
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    borderRadius: 30,
    marginLeft: RFPercentage(1.3),
  },
  editConatiner: {
    borderRadius: 90,
    position: "absolute",
    bottom: -3,
    right: -12,
    padding: 7,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 999,
  },
  userNameText: {
    elevation: 5,
  },
  profileListItemConatiner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avtarWithTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: RFPercentage(2),
  },
});
