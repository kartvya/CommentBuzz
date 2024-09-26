import CustomDrawer from "@/src/components/CustomDrawer";
import { DarkColors, useThemeColors } from "@/src/constants/Colors";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  const themeColors = useThemeColors();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: false,
          drawerPosition: "right",
          swipeEnabled: false,
          drawerActiveTintColor: themeColors?.primaryColor,
          drawerStyle: {
            backgroundColor: themeColors?.lightBg,
          },
        }}
        drawerContent={(props) => <CustomDrawer {...props} />}
      />
    </GestureHandlerRootView>
  );
}
