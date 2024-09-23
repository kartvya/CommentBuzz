import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { DarkColors } from "../constants/Colors";
import { NormalText } from "./Text";

const MemoizedCommentView: React.FC<any> = React.memo(({}) => {
  return (
    <View style={styles.comatiner}>
      <NormalText>User</NormalText>
    </View>
  );
});

export default MemoizedCommentView;

const styles = StyleSheet.create({
  comatiner: {
    marginHorizontal: RFPercentage(1),
    backgroundColor: DarkColors.lightBg,
    marginVertical: RFPercentage(1),
    borderRadius: 12,
    padding: RFPercentage(2),
  },
});
