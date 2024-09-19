import CustomDrawer from "@/src/components/CustomDrawer";
import { DarkColors } from "@/src/constants/Colors";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: false,
          drawerPosition: "right",
          swipeEnabled: false,
          drawerActiveTintColor: DarkColors?.primaryColor,
          drawerStyle: {
            backgroundColor: DarkColors?.lightBg,
          },
        }}
        drawerContent={(props) => <CustomDrawer {...props} />}
      />
    </GestureHandlerRootView>
  );
}
