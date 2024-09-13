import { useRouter } from "expo-router";
import { FC, memo, useMemo } from "react";
import { Pressable, StyleSheet, Text, View, ViewProps } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import SvgIcon from "../assets/icons";
import { Colors } from "../constants/Colors";
import Avatar from "./Avatar";
import Spacer from "./Spacer";
import { TitleText } from "./Text";

export const PHOTO_SIZE = 120;

type Props = Pick<ViewProps, "style"> & {
  photo: string;
  name: string;
  bio: string;
};

const ProfileHeader: FC<Props> = ({ style, name, photo, bio }) => {
  const containerStyle = useMemo(() => [styles.container, style], []);
  const navigation = useRouter();

  return (
    <View style={containerStyle}>
      <View style={styles.avtarConatiner}>
        <Avatar uri={photo} size={RFPercentage(13)} borderRadius={30} />
        <Pressable
          style={styles.editConatiner}
          onPress={() => navigation.navigate("/(main)/editProfile")}
        >
          <SvgIcon name={"edit"} size={20} />
        </Pressable>
      </View>
      <Spacer gap={RFPercentage(0.7)} />
      <View style={{ alignItems: "center" }}>
        <TitleText style={styles.userNameText}>{name}</TitleText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: { marginLeft: 24, justifyContent: "center", flex: 1 },
  name: { fontSize: 24, fontWeight: "700" },
  bio: { fontSize: 15, marginTop: 4 },
  photo: {
    height: PHOTO_SIZE,
    width: PHOTO_SIZE,
    borderRadius: PHOTO_SIZE / 2,
  },
  container: {
    backgroundColor: "white",
    alignItems: "center",
    paddingTop: RFPercentage(1),
  },
  avtarConatiner: {
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    backgroundColor: Colors.white,
    borderRadius: 30,
  },
  editConatiner: {
    backgroundColor: Colors.white,
    borderRadius: 90,
    position: "absolute",
    bottom: -3,
    right: -12,
    padding: 7,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 999,
  },
  userNameText: {},
});

export default memo(ProfileHeader);
