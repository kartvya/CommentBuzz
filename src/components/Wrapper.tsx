import React, { ReactNode } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { MXicon } from "./Icons";
import { useNavigation } from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Colors } from "@/src/constants/Colors";
import { useRouter } from "expo-router";

interface WrapperProps {
  children: ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  const navigation = useRouter();
  const onPressSpiral = () => {
    navigation.navigate("/welcome");
  };

  return (
    <SafeAreaView style={styles.container}>
      {children}
      <TouchableOpacity
        onPress={onPressSpiral}
        hitSlop={styles.hitSlopStyle}
        style={styles.spiralContainer}
      >
        <MXicon
          type="AntDesign"
          name={"plus"}
          color={Colors.black}
          size={Platform.OS == "web" ? RFPercentage(2) : RFPercentage(4)}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  spiralContainer: {
    position: "absolute",
    right: 20,
    bottom: 20,
    height: Platform.OS == "web" ? RFPercentage(4) : RFPercentage(8),
    width: Platform.OS == "web" ? RFPercentage(4) : RFPercentage(8),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 90,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  hitSlopStyle: {
    top: 15,
    right: 15,
    bottom: 15,
    left: 15,
  },
});

export default Wrapper;
