import SvgIcon from "@/src/assets/icons";
import Avatar from "@/src/shared/ui/Avatar";
import CustomTabBar from "@/src/shared/ui/CustomeTabBar/CustomTabBar";
import { DarkColors } from "@/src/shared/constants/colors";
import { UserInfo } from "@/src/modules/auth";
import { RootState } from "@/src/redux/Store";
import { Tabs } from "expo-router";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useSelector } from "react-redux";

export default function TabLayout() {
  const UserInfo = useSelector(
    (state: RootState) => state.auth?.userInfo
  ) as UserInfo;

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: DarkColors?.primaryColor,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: DarkColors?.lightBg,
        },
      }}
    >
      <Tabs.Screen
        name="feedScreen"
        options={() => ({
          tabBarIcon: ({ color, focused }) => (
            <SvgIcon
              size={RFPercentage(3.4)}
              name="home"
              color={focused ? DarkColors?.primaryColor : color}
              strokeWidth="2"
            />
          ),
        })}
      />
      <Tabs.Screen
        name="createPost"
        options={() => ({
          tabBarIcon: ({ color, focused }) => (
            <SvgIcon
              size={RFPercentage(3.4)}
              name="plus"
              color={focused ? DarkColors?.primaryColor : color}
              strokeWidth="2"
            />
          ),
        })}
      />
      <Tabs.Screen
        name="Profile"
        options={() => ({
          tabBarIcon: ({ color, focused }) => (
            <Avatar
              uri={UserInfo?.profilePic}
              size={RFPercentage(3.8)}
              borderRadius={100}
              avatarImgStyle={{
                borderWidth: 2,
                borderColor: focused ? DarkColors?.primaryColor : color,
              }}
            />
          ),
        })}
      />
    </Tabs>
  );
}
