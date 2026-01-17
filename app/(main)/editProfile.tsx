import SvgIcon from "@/src/assets/icons";
import Button from "@/src/shared/ui/Button";
import Header from "@/src/shared/ui/Header";
import Input from "@/src/shared/ui/Input";
import ScreenWrapper from "@/src/shared/ui/ScreenWrapper";
import Spacer from "@/src/shared/ui/Spacer";
import { DarkColors, useThemeColors } from "@/src/shared/constants/colors";
import { hp, wp } from "@/src/shared/utils/comman";
import { RootState } from "@/src/redux/Store";
import { getUserImage } from "@/src/shared/utils/imageServices";
import * as ImagePicker from "expo-image-picker";

import { setUserInfo } from "@/src/modules/auth/ui/auth.slice";
import { UserInfo } from "@/src/modules/auth";
import { useEditProfile } from "@/src/modules/profile/hooks/useEditProfile";
import { EditProfileRequest } from "@/src/modules/profile/domain/profile.entity";
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
  image: ImagePicker.ImagePickerAsset | Record<string, never>;
  bio: string;
}
const EditProfile = () => {
  const {
    editProfile,
    isLoading: isEditingProfile,
    validationErrors,
  } = useEditProfile();
  const navigation = useRouter();
  const dispatch = useDispatch();
  const themeColors = useThemeColors();
  const UserInfo = useSelector(
    (state: RootState) => state.auth?.userInfo
  ) as UserInfo;

  const [user, setUser] = useState<UpdatedUsersData>({
    email: "",
    name: "",
    image: {},
    bio: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    bio: "",
  });

  const isLoading = isEditingProfile;

  useEffect(() => {
    if (UserInfo) {
      setUser({
        name: UserInfo?.username || "",
        image:
          typeof UserInfo?.profilePic === "object" ? UserInfo.profilePic : {},
        bio: UserInfo?.bio || "",
        email: UserInfo?.email || "",
      });
    }
  }, [UserInfo]);

  // Update error states from validation errors
  useEffect(() => {
    if (validationErrors) {
      if (validationErrors.username) {
        setErrors((prev) => ({
          ...prev,
          name: validationErrors.username[0] || "",
        }));
      } else {
        setErrors((prev) => ({ ...prev, name: "" }));
      }
      if (validationErrors.bio) {
        setErrors((prev) => ({ ...prev, bio: validationErrors.bio[0] || "" }));
      } else {
        setErrors((prev) => ({ ...prev, bio: "" }));
      }
    } else {
      setErrors({ name: "", bio: "" });
    }
  }, [validationErrors]);

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

  const onUpdateUserData = async () => {
    if (isLoading) {
      return;
    }

    try {
      // Prepare profile data - use case will handle validation and FormData construction
      const profileData: EditProfileRequest = {
        username: user.name || undefined,
        bio: user.bio || undefined,
        profilePic:
          user.image && "uri" in user.image ? user.image.uri : undefined,
      };

      const res = await editProfile(profileData);
      if (res.success && res.user) {
        dispatch(setUserInfo(res.user));
      }
      navigation.back();
    } catch (error) {
      console.log("Error", error);
    }
  };

  const checkObj = (
    obj: Record<string, unknown> | null | undefined,
    key: string
  ): boolean => {
    return !!(obj && typeof obj === "object" && key in obj);
  };

  const imageSource = checkObj(user.image, "uri")
    ? user.image?.uri
    : getUserImage(UserInfo.profilePic);

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
          textStyle={{
            color: DarkColors.white,
          }}
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
