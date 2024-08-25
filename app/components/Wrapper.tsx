import React, { ReactNode } from "react";
import {
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
import { Colors } from "@/constants/Colors";

interface WrapperProps {
  children: ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const onPressSpiral = () => {
    navigation.navigate("uploadPost");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.dark.background}
      />
      {children}
      <TouchableOpacity
        onPress={onPressSpiral}
        hitSlop={styles.hitSlopStyle}
        style={styles.spiralContainer}
      >
        <MXicon
          type="AntDesign"
          name={"plus"}
          color={Colors.dark.background}
          size={RFPercentage(4)}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.text,
  },
  spiralContainer: {
    position: "absolute",
    right: 20,
    bottom: 20,
    height: 70,
    width: 70,
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
