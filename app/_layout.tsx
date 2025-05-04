import { persistor, store } from "@/src/redux/Store";
import { getUserData } from "@/src/services/userService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Href, SplashScreen, Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

SplashScreen.preventAutoHideAsync();

const MainLayout = () => {
  const dispatch = useDispatch();
  const navigation = useRouter();

  useEffect(() => {
    updateUserData();
  }, []);

  const updateUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("UserToken");
      if (token) {
        navigation.navigate("/(drawer)/(tabs)/feedScreen");
      } else {
        navigation.navigate("/welcome" as Href);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return <Stack screenOptions={{ headerShown: false }} />;
};

function _layout() {
  const [loaded, error] = useFonts({
    "SpaceMono-Regular": require("../src/assets/fonts/SpaceMono-Regular.ttf"),
    "SpaceMono-Bold": require("../src/assets/fonts/SpaceMono-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded) {
    return null;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <MainLayout />
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default _layout;
