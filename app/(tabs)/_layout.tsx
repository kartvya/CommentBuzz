import SvgIcon from "@/src/assets/icons";
import Avatar from "@/src/components/Avatar";
import { Colors } from "@/src/constants/Colors";
import { Tabs } from "expo-router";
import { RFPercentage } from "react-native-responsive-fontsize";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primeColor,
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="feedScreen"
        options={({ navigation, route }) => ({
          tabBarIcon: ({ color, focused }) => (
            <SvgIcon
              size={RFPercentage(3.4)}
              name="home"
              color={focused ? Colors.primeColor : color}
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
              uri=""
              size={RFPercentage(3.8)}
              borderRadius={100}
              avatarImgStyle={{
                borderWidth: 2,
                borderColor: focused ? Colors.primeColor : color,
              }}
            />
          ),
        })}
      />
    </Tabs>
  );
}
