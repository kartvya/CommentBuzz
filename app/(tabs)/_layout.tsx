import { Colors } from "@/src/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { StyleSheet, useColorScheme } from "react-native";

export default function TabLayout() {
  const theme = useColorScheme() ?? "light";
  const activeColor = theme === "light" ? Colors.primeColor : "#EF9337";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="feedScreen"
        options={({ navigation, route }) => ({
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              size={28}
              name="home"
              color={focused ? activeColor : color}
            />
          ),
        })}
      />
      <Tabs.Screen
        name="explore"
        options={({ navigation, route }) => ({
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              size={28}
              name="cog"
              color={focused ? activeColor : color}
            />
          ),
        })}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({});
