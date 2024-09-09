import Loading from "@/src/components/Loading";
import { TitleText } from "@/src/components/Text";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useCallback } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const navigation = useRouter();
  const [loaded, error] = useFonts({
    "SpaceMono-Regular": require("../src/assets/fonts/SpaceMono-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (loaded || error) {
      await SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <Loading />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
