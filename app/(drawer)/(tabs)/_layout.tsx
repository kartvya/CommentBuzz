import SvgIcon from "@/src/assets/icons";
import Avatar from "@/src/components/Avatar";
import { DarkColors } from "@/src/constants/Colors";
import { Users } from "@/src/redux/reducers/AuthReducer";
import { RootState } from "@/src/redux/Store";
import { Tabs } from "expo-router";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useSelector } from "react-redux";
import CustomTabBar from "@/src/components/CustomeTabBar/CustomTabBar";

export default function TabLayout() {
  const UserInfo = useSelector(
    (state: RootState) => state.root?.authReducer?.userInfo
  ) as Users;

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        // tabBarActiveTintColor: DarkColors?.primaryColor,
        // tabBarShowLabel: false,
        // tabBarStyle: {
        //   backgroundColor: DarkColors?.lightBg,
        // },
      }}
    >
      <Tabs.Screen
        name="feedScreen"
        options={({ navigation, route }) => ({
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
        options={({ navigation, route }) => ({
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
        options={({ navigation, route }) => ({
          tabBarIcon: ({ color, focused }) => (
            <Avatar
              uri={UserInfo?.image}
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
