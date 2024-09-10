import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { Colors } from "@/src/constants/Colors";
import Header from "@/src/components/Header";
import Avatar from "@/src/components/Avatar";
import { RFPercentage } from "react-native-responsive-fontsize";
import SvgIcon from "@/src/assets/icons";
import { useRouter } from "expo-router";
import Input from "@/src/components/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { hp, wp } from "@/src/helpers/comman";
import Spacer from "@/src/components/Spacer";
import { NormalText } from "@/src/components/Text";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/Store";
import { Users } from "@/src/redux/reducers/AuthReducer";
import Button from "@/src/components/Button";
import * as ImagePicker from "expo-image-picker";
import { getUserImage } from "@/src/services/imageServices";
interface UpdatedUsersData {
  email: string;
  name: string;
  phonNumber: string;
  image: Partial<any>;
  bio: string;
  address: string;
}

const EditProfile = () => {
  const navigation = useRouter();
  const UserInfo = useSelector(
    (state: RootState) => state.root?.authReducer?.userInfo
  ) as Users;
  const [user, setUser] = useState<UpdatedUsersData>({
    email: "",
    name: "",
    phonNumber: "",
    image: {},
    bio: "",
    address: "",
  });

  useEffect(() => {
    if (UserInfo) {
      setUser({
        name: UserInfo?.name || "",
        phonNumber: UserInfo?.phonNumber || "",
        image: typeof UserInfo?.image === "object" ? UserInfo.image : {},
        bio: UserInfo?.bio || "",
        address: UserInfo?.address || "",
        email: UserInfo?.email || "",
      });
    }
  }, [UserInfo]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setUser({ ...user, image: result.assets[0] });

      {
        /* MOVE TO ON SUBMIT */
      }
      // let imageRes = await uploadFile("profiles", result.assets[0]?.uri, true);
      // console.log(imageRes.data, "dasdasdasdasd");
    }
  };

  const imageSource =
    user.image && typeof user.image === "object"
      ? user.image?.uri
      : getUserImage(UserInfo.image);

  return (
    <ScreenWrapper bg={Colors.white}>
      <Header title={"Edit Profile"} showBackIcon={true} mb={RFPercentage(2)} />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ marginHorizontal: wp(3) }}
      >
        <View style={styles.avtarConatiner}>
          <Avatar uri={imageSource} size={RFPercentage(13)} borderRadius={30} />
          <Pressable style={styles.editConatiner} onPress={pickImage}>
            <SvgIcon name={"camera"} size={20} />
          </Pressable>
        </View>
        <Spacer gap={RFPercentage(3)} />
        <Input
          containerStyle={{ backgroundColor: "rgba(0,0,0,0.1)" }}
          icon={<SvgIcon name={"mail"} size={26} color={Colors.icon} />}
          placeholderText="Enter your email"
          onChangeText={(txt) => setUser({ ...user, name: txt })}
          error={""}
          editable={false}
          value={user.email}
        />
        <Spacer gap={wp(3)} />
        <Input
          containerStyle={{}}
          icon={<SvgIcon name={"user"} size={26} color={Colors.icon} />}
          placeholderText="Enter your username"
          onChangeText={(txt) => setUser({ ...user, name: txt })}
          error={""}
          value={user.name}
        />
        <Spacer gap={wp(3)} />
        <Input
          containerStyle={{}}
          icon={<SvgIcon name={"call"} size={26} color={Colors.icon} />}
          placeholderText="Enter your phone number"
          onChangeText={(txt) => setUser({ ...user, phonNumber: txt })}
          error={""}
          value={user.phonNumber}
        />
        <Spacer gap={wp(3)} />
        <Input
          containerStyle={styles.textAreaStyle}
          placeholderText="Enter your bio"
          onChangeText={(txt) => setUser({ ...user, bio: txt })}
          error={""}
          multiline={true}
          value={user.bio}
        />
        <Spacer gap={wp(5)} />
        <Button title="Update" onPress={() => navigation.back()} />
      </KeyboardAwareScrollView>
    </ScreenWrapper>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
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
  textAreaStyle: {
    height: hp(15),
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "flex-start",
  },
});
