import React, { FC, memo, useMemo } from "react";
import { StyleSheet, Text, View, ViewProps } from "react-native";
import { NormalText, TitleText } from "./Text";
import Avatar from "./Avatar";
import { RFPercentage } from "react-native-responsive-fontsize";

type Props = Pick<ViewProps, "style"> & { name: string; photo: string };

const HeaderOverlay: FC<Props> = ({ style, name, photo }) => {
  const containerStyle = useMemo(() => [styles.container, style], [style]);

  return (
    <View style={containerStyle}>
      <Avatar
        uri={photo}
        size={RFPercentage(4)}
        borderRadius={30}
        avatarImgStyle={styles.avtarStyle}
      />
      <TitleText style={styles.title}>{name}</TitleText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: RFPercentage(2),
  },
  title: {
    marginLeft: RFPercentage(2),
  },
  avtarStyle: {
    borderWidth: 1,
  },
});

export default memo(HeaderOverlay);
