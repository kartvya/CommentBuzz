import { supabase } from "@/lib/supabase";
import { USERINFO } from "@/src/redux/actions/ActionType";
import { persistor, store } from "@/src/redux/Store";
import { getUserData } from "@/src/services/userService";
import { User } from "@supabase/supabase-js";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

SplashScreen.preventAutoHideAsync();

const MainLayout = () => {
  const dispatch = useDispatch();
  const navigation = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        dispatch({
          type: USERINFO,
          payload: {
            userInfo: session?.user,
          },
        });
        updateUserData(session?.user);
      } else {
        dispatch({
          type: USERINFO,
          payload: {
            userInfo: null,
          },
        });
        navigation.navigate("/welcome");
      }
    });
  }, []);

  const updateUserData = async (userData: User) => {
    try {
      const res = await getUserData(userData?.id);
      if (res.success) {
        const currentUserInfo = store.getState().root?.authReducer.userInfo;
        dispatch({
          type: USERINFO,
          payload: {
            userInfo: {
              ...currentUserInfo,
              ...res?.data,
            },
          },
        });
        navigation.navigate("/(drawer)/(tabs)/feedScreen");
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
