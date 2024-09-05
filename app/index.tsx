import { TitleText } from "@/src/components/Text";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";

export default function index() {
  const [loaded, error] = useFonts({
    "SpaceMono-Regular": require("../src/assets/fonts/SpaceMono-Regular.ttf"),
  });

  // useEffect(() => {
  //   if (loaded || error) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [loaded, error]);

  // if (!loaded && !error) {
  //   return null;
  // }

  const navigation = useRouter();
  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.navigate("/welcome")}>
        <TitleText style={{ fontSize: 30 }}>Welocome screen</TitleText>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("/login")}>
        <TitleText style={{ fontSize: 30 }}>Login screen</TitleText>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("/signup")}>
        <TitleText style={{ fontSize: 30 }}>Signup screen</TitleText>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("/(tabs)/feedScreen")}>
        <TitleText style={{ fontSize: 30 }}>Tabs screen</TitleText>
      </Pressable>
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
