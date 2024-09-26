import SvgIcon from "@/src/assets/icons";
import Button from "@/src/components/Button";
import Header from "@/src/components/Header";
import Input from "@/src/components/Input";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import Spacer from "@/src/components/Spacer";
import { useThemeColors } from "@/src/constants/Colors";
import { hp, wp } from "@/src/helpers/comman";
import { RootState } from "@/src/redux/Store";
import { Users } from "@/src/redux/reducers/AuthReducer";
import { getUserImage, uploadFile } from "@/src/services/imageServices";
import * as ImagePicker from "expo-image-picker";

import { USERINFO } from "@/src/redux/actions/ActionType";
import { updateUser } from "@/src/services/userService";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";

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
  const dispatch = useDispatch();
  const themeColors = useThemeColors();
  const UserInfo = useSelector(
    (state: RootState) => state.root?.authReducer?.userInfo
  ) as Users;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<UpdatedUsersData>({
    email: "",
    name: "",
    phonNumber: "",
    image: {},
    bio: "",
    address: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    phonNumber: "",
    bio: "",
  });

  useEffect(() => {
    if (UserInfo) {
      setUser({
        name: UserInfo?.name || "",
        phonNumber: UserInfo?.phonNumber || "",
        image: typeof UserInfo?.image === "object" ? UserInfo.image : {},
        bio: UserInfo?.bio || "",
        address: UserInfo?.address || "",
        email: UserInfo?.user_metadata?.email || "",
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
    }
  };

  const validateUserData = () => {
    let isValid = true;
    let newErrors = { name: "", phonNumber: "", bio: "" };

    if (!user.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (user.phonNumber?.length > 0) {
      if (!/^\d{10}$/.test(user.phonNumber)) {
        newErrors.phonNumber = "Phone number must be 10 digits";
        isValid = false;
      }
    }

    if (user.bio.length > 200) {
      newErrors.bio = "Bio must be less than 200 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const onUpdateUserData = async () => {
    if (!validateUserData()) {
      return;
    }

    try {
      setIsLoading(true);
      if (typeof user.image === "object") {
        let imageRes = await uploadFile("profiles", user?.image?.uri, true);
        if (imageRes?.success) {
          user.image = imageRes?.data;
        }
      }
      let updateUserRes = await updateUser(UserInfo?.id, user);
      if (updateUserRes.success) {
        dispatch({
          type: USERINFO,
          payload: {
            userInfo: {
              ...UserInfo,
              ...updateUserRes?.data,
            },
          },
        });
        navigation.back();
        setIsLoading(false);
      } else {
        console.log("Update user error");
      }
    } catch (error) {
      setIsLoading(false);
      console.log("Error", error);
    }
  };

  const checkObj = (obj: any, key: string) => {
    return obj && typeof obj === "object" && key in obj;
  };

  const imageSource = checkObj(user.image, "uri")
    ? user.image?.uri
    : getUserImage(UserInfo.image);

  return (
    <ScreenWrapper>
      <Header title={"Edit Profile"} showBackIcon={true} />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ marginHorizontal: wp(3) }}
      >
        <Spacer gap={wp(3)} />
        <View style={styles.avtarConatiner}>
          <Image style={styles.avatar} source={imageSource} />
          <Pressable
            style={[
              styles.editConatiner,
              { backgroundColor: themeColors.votesBg },
            ]}
            onPress={pickImage}
          >
            <SvgIcon name={"camera"} size={20} color={themeColors?.text} />
          </Pressable>
        </View>
        <Spacer gap={RFPercentage(3)} />
        <Input
          containerStyle={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          icon={<SvgIcon name={"mail"} size={26} color={themeColors.icon} />}
          placeholderText="Enter your email"
          onChangeText={(txt) => setUser({ ...user, name: txt })}
          error={""}
          editable={false}
          value={user.email}
          onPressIn={() => alert("You can not edit email.")}
        />
        <Spacer gap={wp(3)} />
        <Input
          containerStyle={{}}
          icon={<SvgIcon name={"user"} size={26} color={themeColors.icon} />}
          placeholderText="Enter your username"
          onChangeText={(txt) => setUser({ ...user, name: txt })}
          error={errors?.name}
          value={user.name}
        />
        <Spacer gap={errors?.name ? wp(2) : wp(3)} />
        <Input
          containerStyle={{}}
          icon={<SvgIcon name={"call"} size={26} color={themeColors.icon} />}
          placeholderText="Enter your phone number"
          onChangeText={(txt) => setUser({ ...user, phonNumber: txt })}
          error={errors?.phonNumber}
          value={user.phonNumber}
          maxLength={10}
        />
        <Spacer gap={errors?.phonNumber ? wp(2) : wp(3)} />
        <Input
          containerStyle={styles.textAreaStyle}
          placeholderText="Enter your bio"
          onChangeText={(txt) => setUser({ ...user, bio: txt })}
          error={errors?.bio}
          multiline={true}
          value={user.bio}
        />
        <Spacer gap={errors?.bio ? wp(4) : wp(5)} />
        <Button
          title="Update"
          onPress={() => onUpdateUserData()}
          isLoading={isLoading}
        />
      </KeyboardAwareScrollView>
    </ScreenWrapper>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  avtarConatiner: {
    height: RFPercentage(13),
    width: RFPercentage(13),
    backgroundColor: "white",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 30,
  },
  avatar: {
    flex: 1,
    borderRadius: 30,
  },
  editConatiner: {
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
