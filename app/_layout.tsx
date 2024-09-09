import { supabase } from "@/lib/supabase";
import { USERINFO } from "@/src/redux/actions/ActionType";
import { persistor, store } from "@/src/redux/Store";
import { getUserData } from "@/src/services/userService";
import { User } from "@supabase/supabase-js";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

const MainLayout = () => {
  const dispatch = useDispatch();
  const navigation = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
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
        dispatch({
          type: USERINFO,
          payload: {
            userInfo: res?.data,
          },
        });
        navigation.navigate("/(tabs)/feedScreen");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return <Stack screenOptions={{ headerShown: false }} />;
};

function _layout() {
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
